import {
  BehaviorSubject,
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

function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

function isObservable(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.subscribe === 'function'
  )
}

const KICKSTART_ACTION = { type: '_INIT_' }

export default function createDispatcher(opts = {}) {
  const dispatcher = new Subject()

  const identifier = Symbol()
  const cache = []

  const scheduler = opts.scheduler || Scheduler.asap

  const logging = parseOpts(opts.logging)
  if (logging.agendas) {
    logAgendas(dispatcher)
  }

  function next(agenda) {
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
    ), `Method 'dispatch' only takes thunks and actions as arguments.`)

    if (isPromise(action)) {
      next(Observable.fromPromise(action))
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
    assert(agendas.reduce((acc, obj) => acc && isObservable(obj), true), `Agendas can only be represented by Observables.`)

    if (agendas.length === 1) {
      next(agendas[0])
    } else if (agendas.length > 1) {
      next(Observable.concat(...agendas))
    }
  }

  function getState(fn) {
    if (typeof fn[identifier] === 'number') {
      return cache[fn[identifier]].store.getValue()
    }

    console.error(`Function wasn't yet reduced and is therefore unknown.`)
    return undefined
  }

  function reduce(fn, init) {
    if (typeof fn[identifier] === 'number') {
      return cache[fn[identifier]].store
    }

    // Create cursor pointing to the state history
    let cursor = createState(fn, fn(init, KICKSTART_ACTION))

    const initialState = Observable.of(cursor.state)

    // Describe states using the series of agendas
    const scan = dispatcher
      .flatMap(agenda => {
        // Reference agenda's root state
        const anchor = cursor

        // Prepare agenda logger if necessary
        const logger = logging.stores ? logStore(fn.name, agenda) : null

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
      .publish()

    // Concat initialState with the actual store
    const store = initialState.concat(scan)

    // Cache the store
    fn[identifier] = cache.length
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

    throw `Method 'wrapActions' expects either an action creator or an array/object containing some as arguments.`
  }

  return Object.assign(dispatcher.mergeAll(), {
    dispatch,
    schedule,
    getState,
    reduce,
    wrapActions
  })
}

