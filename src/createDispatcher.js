import {
  Subject,
  BehaviorSubject,
  Scheduler,
  Observable
} from 'rxjs'

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
import toObservable from './util/toObservable'
import isObservable from './util/isObservable'

const KICKSTART_ACTION = { type: '_INIT_' }

export function Dispatcher(opts = {}, middlewares) {
  if (!middlewares) {
    middlewares = []
  }

  Subject.call(this)

  this.identifier = Symbol()
  this.cache = []
  this.middlewares = [].concat(middlewares).map(x => x(this))

  // Options: Scheduler
  this.scheduler = opts.scheduler || Scheduler.queue

  // Options: Logging
  this.logging = parseOpts(opts.logging)
  if (this.logging.agendas) {
    logAgendas(this)
  }

  this.reduce = this.reduce.bind(this)
  this.rawNext = this.rawNext.bind(this)
  this.next = this.next.bind(this)
}

// Inherit from Rx.Subject
Dispatcher.prototype = Object.create(Subject.prototype)
Dispatcher.prototype.constructor = Dispatcher

Dispatcher.prototype.reduce = function reduce(fn, init) {
  const { cache, identifier, logging } = this

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
    .concat(this
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

// Save subject's normal next method
Dispatcher.prototype.rawNext = Dispatcher.prototype.next

Dispatcher.prototype.next = function next(arg) {
  const { middlewares, scheduler } = this
  let agenda = toObservable(arg)
    .subscribeOn(scheduler)
    .share()

  for (let i = 0; i < middlewares.length; i++) {
    const middleware = middlewares[i]
    agenda = middleware(agenda)

    if (!isObservable(agenda)) {
      return undefined
    }
  }

  return this.rawNext(agenda
    .filter(Boolean)
    .publishReplay()
    .refCount())
}

export default function createDispatcher(opts, middlewares) {
  return new Dispatcher(opts, middlewares)
}

