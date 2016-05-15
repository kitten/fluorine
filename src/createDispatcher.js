import {
  Subject,
  BehaviorSubject,
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
import wrapActions from './util/wrapActions'
import isPromise from './util/isPromise'
import isObservable from './util/isObservable'

const KICKSTART_ACTION = { type: '_INIT_' }

function toObservable(arg) {
  if (isObservable(arg)) {
    return arg
  } else if (isPromise(arg)) {
    return Observable.fromPromise(arg)
  }

  return Observable.of(arg)
}

export default function createDispatcher(opts = {}, middlewares = []) {
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

  const res = {
    reduce,
    wrapActions: x => wrapActions(dispatcher, x),
    complete: x => dispatcher.complete(x),
    error: x => dispatcher.error(x),
    next: x => dispatcher.next(toObservable(x)
      .subscribeOn(scheduler)
      .publishReplay()
      .refCount())
  }

  const _middlewares = middlewares.map(x => x(res))
  const pipeline = dispatcher
    .flatMap(agenda => {
      for (const middleware of _middlewares) {
        agenda = middleware(agenda)
      }

      return agenda
    })

  function reduce(fn, init) {
    if (typeof fn[identifier] === 'number') {
      return cache[fn[identifier]].store
    }

    // Generate cache index and set it on the reducer
    const index = cache.length
    fn[identifier] = index

    // Create cursor pointing to the state history
    let cursor = createState(fn, fn(init, KICKSTART_ACTION))

    // Describe states using the series of agendas
    const store = Observable.of(cursor.state)
      .concat(pipeline
        .map(agenda => {
          // Reference agenda's root state
          const anchor = cursor

          // Collect agenda's actions
          const actions = []

          // Prepare agenda logger if necessary
          const logger = logging.stores ? logStore(fn.name || index, agenda) : null

          // Map Agenda to consecutive states and catch errors
          return agenda
            .map(action => {
              cursor = cursor.doNext(action)
              actions.push(action)

              if (logger) {
                logger.change(action, cursor.state) // Logging new state by action
              }

              return cursor.state
            })
            .catch(err => {
              if (!logger) {
                console.error(err)
              }

              // Filter past actions by all of the failed agenda
              const previousState = cursor.state
              filterActions(anchor, x => actions.indexOf(x) === -1)

              if (logger) {
                logger.revert([ previousState, cursor.state ], err, actions) // Logging reversion
              }

              return Observable.of(cursor.state)
            })
            .distinctUntilChanged()
        })
        .mergeAll())
      .distinctUntilChanged()
      .publishReplay(1)

    const subscription = store.connect()

    // Cache the store
    cache.push({
      store,
      subscription
    })

    return store
  }

  return Object.assign(Object.create(pipeline), res)
}

