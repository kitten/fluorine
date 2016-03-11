import {
  Subject,
  Scheduler,
  Observable
} from '@reactivex/rxjs'

import {
  createState,
  filterActions
} from './util/state'

import {
  parseOpts,
  logAgendas,
  logStore
} from './util/logger'

import assert from './util/assert'
import isPromise from './util/isPromise'
import isObservable from './util/isObservable'

const KICKSTART_ACTION = { type: '_INIT_' }

export default function createDispatcher(opts = {}) {
  const dispatcher = new Subject()

  const identifier = Symbol()
  const cache = []

  // Options: Scheduler
  const scheduler = opts.scheduler || Scheduler.queue

  // Options: Logging
  const logging = parseOpts(opts.logging)
  if (logging.agendas) {
    logAgendas(dispatcher)
  }

  function nextAgenda(agenda) {
    const obs = agenda
      .subscribeOn(scheduler)
      .publishReplay()
      .refCount()

    dispatcher.next(obs)
  }

  function dispatch(action) {
    assert((
      typeof action === 'function' ||
      typeof action === 'object'
    ), 'Expected a thunk, promise or action as argument.')

    if (isPromise(action)) {
      nextAgenda(Observable.fromPromise(action))
      return action
    }

    if (typeof action === 'function') {
      const res = action(x => {
        dispatcher.next(Observable.of(x))
      })

      return Promise.resolve(res)
    }

    dispatcher.next(Observable.of(action))
    return Promise.resolve(action)
  }

  function schedule(...agendas) {
    assert(agendas.reduce((acc, obj) => acc && isObservable(obj), true), 'Agendas can only be represented by Observables.')

    if (agendas.length === 1) {
      nextAgenda(agendas[0])
    } else if (agendas.length > 1) {
      nextAgenda(Observable.concat(...agendas))
    }
  }

  function reduce(fn, init) {
    if (typeof fn[identifier] === 'number') {
      return cache[fn[identifier]].store
    }

    // Generate cache index and set it on the reducer
    const index = cache.length
    fn[identifier] = index

    // Create cursor pointing to the state history
    let cursor = createState(fn, fn(init, KICKSTART_ACTION))
    const initialState = cursor.state

    // Describe states using the series of agendas
    const scan = dispatcher
      .flatMap(agenda => {
        // Reference agenda's root state
        const anchor = cursor

        // Prepare agenda logger if necessary
        const logger = logging.stores ? logStore(fn.name || index, agenda) : null

        // Map Agenda to consecutive states and catch errors
        return agenda
          .filter(action => !!action)
          .map(action => {
            cursor = cursor.doNext(action)

            if (logger) {
              logger.change(action, cursor.state) // Logging new state by action
            }

            return cursor.state
          })
          .catch(err => {
            if (!logger) {
              console.error(err)
            }

            return agenda
              .reduce((acc, x) => [ ...acc, x ], [])
              .map(actions => {
                // Filter past actions by all of the failed agenda
                const previousState = cursor.state
                filterActions(anchor, x => actions.indexOf(x) === -1)

                if (logger) {
                  logger.revert([ previousState, cursor.state ], err, actions) // Logging reversion
                }

                return cursor.state
              })
          })
      })
      .distinctUntilChanged()

    const store = Observable
      .of(initialState)
      .concat(scan)
      .publish()

    // Cache the store
    cache.push({
      store
    })

    return store
  }

  function wrapActions(arg) {
    const transform = fn => (...args) => dispatch(fn(...args))

    if (typeof arg === 'function') {
      return transform(arg)
    }

    if (Array.isArray(arg)) {
      return arg.map(fn => {
        assert(typeof fn === 'function', 'Expected array to contain exclusively functions.')
        return transform(fn)
      })
    }

    if (typeof arg === 'object') {
      return Object.keys(arg).reduce((prev, key) => {
        if (arg.hasOwnProperty(key)) {
          const fn = arg[key]
          assert(typeof fn === 'function', 'Expected object to contain exclusively functions.')
          prev[key] = transform(fn)
        }

        return prev
      }, {})
    }

    throw new Error('Expected either an action creator or an array/object containing some as arguments.')
  }

  return Object.assign(Object.create(dispatcher), {
    next(obj) {
      if (isObservable(obj)) {
        schedule(obj)
      } else {
        dispatch(obj)
      }
    },
    dispatch,
    schedule,
    reduce,
    wrapActions
  })
}

