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

const kickstart = { type: '_INIT_' }

export default function createDispatcher(opts = {}) {
  const dispatcher = new Subject()

  // Question: what is this intended for? I see it used below in
  // ways that make it seem like the Symbol is for scope hiding
  // (as they were defined for), not sure what the intention is though
  const identifier = Symbol()
  const cache = []
  const state = []

  let scheduler
  // Now this is interesting, you're letting folks pick the scheduler
  // Does this pick up derivative schedulers like the requestAnimationFrameScheduler
  switch (opts.scheduler) {
    case Scheduler.asap:
    case Scheduler.queue: {
      scheduler = opts.scheduler
      break
    }
    default: scheduler = Scheduler.asap
  }

  const logging = parseOpts(opts.logging)
  if (logging.agendas) {
    // Seems like this means that middlewares are effectively an attachment on dispatchers
    logAgendas(dispatcher)
  }

  function next(agenda) {
    const obs = agenda
      .subscribeOn(scheduler)
      .publishReplay() // Would this make all my actions replayable?
                       // What if they are expensive or can't be performed again?
                       // I definitely need to look up publishReplay when I have internet again
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
    if (typeof fn[identifier] === 'number')
      return state[fn[identifier]]()


    console.error(`Function wasn't yet reduced and is therefore unknown.`)
  }

  function reduce(fn, init) {
    if (typeof fn[identifier] === 'number')
      return cache[fn[identifier]]

    // Index and name
    fn[identifier] = cache.length
    const name = fn.name || `#${fn[identifier]}`

    let anchor = createState(fn, fn(init, kickstart))

    const store = new BehaviorSubject(anchor.state)

    dispatcher.subscribe(agenda => {
      let pastAnchor = null
      const bucket = []

      let logger
      if (logging.stores) {
        logger = logStore(name, agenda)
      }

      agenda.subscribe(action => {
        if (!pastAnchor) {
          pastAnchor = anchor
        }

        if (action) {
          bucket.push(action)

          const newAnchor = anchor.doNext(action)

          if (anchor !== newAnchor) {
            anchor = newAnchor
            store.next(anchor.state)

            if (logging.stores && logger) {
              logger.change(action, anchor.state)
            }
          }
        }
      }, err => {
        if (!logging.stores || !logger) {
          console.error(err)
        }

        // Only revert if there were actions emitted and a past state
        if (pastAnchor && bucket.length > 0) {
          const prevState = anchor.state

          filterActions(pastAnchor, x => bucket.indexOf(x) === -1)

          // Only emit and log if it actually changed something
          if (prevState !== anchor.state) {
            store.next(anchor.state)

            if (logging.stores && logger) {
              logger.revert([ prevState, anchor.state ], err, bucket)
            }
          }
        }
      })
    })

    state.push(store.getValue.bind(store))
    cache.push(store)

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
