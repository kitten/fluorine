import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { of } from 'rxjs/observable/of'
import { concat } from 'rxjs/operator/concat'
import { map } from 'rxjs/operator/map'
import { mergeMap } from 'rxjs/operator/mergeMap'
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged'
import { publishReplay } from 'rxjs/operator/publishReplay'
import { subscribeOn } from 'rxjs/operator/subscribeOn'
import { share } from 'rxjs/operator/share'
import { filter } from 'rxjs/operator/filter'
import { _catch } from 'rxjs/operator/catch'

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

export function Dispatcher(opts = {}, middlewares = []) {
  Subject.call(this)

  this.keyCache = []
  this.valCache = []

  this.middlewares = [].concat(middlewares).map(x => x(this))

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
  const { keyCache, valCache, logging } = this

  const index = keyCache.indexOf(fn)
  if (index > -1) {
    return valCache[index].store
  }

  // Create cursor pointing to the state history
  let cursor = createState(fn, fn(init, KICKSTART_ACTION))

  // Describe states using the series of agendas
  const store = of(cursor.state)
    ::concat(this
      ::mergeMap(agenda => {
        // Reference agenda's root state
        const anchor = cursor

        // Collect agenda's actions
        const actions = []

        // Prepare agenda logger if necessary
        let logger = null

        if (logging.stores) {
          if (typeof logging.stores === 'function') {
            logger = logging.stores(fn.name || index, agenda)
          } else {
            logger = logStore(fn.name || index, agenda)
          }
        }

        // Map Agenda to consecutive states and catch errors
        return agenda
          ::map(action => {
            cursor = cursor.doNext(action)
            actions.push(action)

            if (logger) {
              logger.change(action, cursor.state) // Logging new state by action
            }

            return cursor.state
          })
          ::_catch(err => {
            if (!logger) {
              console.error(err)
            }

            // Filter past actions by all of the failed agenda
            const previousState = cursor.state
            filterActions(anchor, x => actions.indexOf(x) === -1)

            if (logger) {
              logger.revert([ previousState, cursor.state ], err, actions) // Logging reversion
            }

            return of(cursor.state)
          })
          ::distinctUntilChanged()
      })
    )
    ::distinctUntilChanged()
    ::publishReplay(1)

  const subscription = store.connect()

  // Cache the store
  const key = keyCache.length
  keyCache.push(fn)
  valCache[key] = { store, subscription }

  return store
}

// Save subject's normal next method
Dispatcher.prototype.rawNext = Dispatcher.prototype.next

Dispatcher.prototype.next = function next(arg) {
  const { middlewares } = this

  let agenda = toObservable(arg)::share()

  for (let i = 0; i < middlewares.length; i++) {
    const middleware = middlewares[i]
    agenda = middleware(agenda)

    if (!isObservable(agenda)) {
      return undefined
    }
  }

  return this.rawNext(
    agenda
      ::filter(Boolean)
      ::publishReplay()
      .refCount()
  )
}

export default function createDispatcher(opts, middlewares) {
  return new Dispatcher(opts, middlewares)
}

