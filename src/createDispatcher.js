import {
  BehaviorSubject,
  Subject,
  Scheduler,
  Observable
} from 'rxjs'

import {
  createState,
  filterActions
} from './util/state'

function isPromise(obj) {
  return Promise.prototype.isPrototypeOf(obj)
}

const kickstart = { type: '_INIT_' }

export default function createDispatcher() {
  const dispatcher = new Subject()

  const identifier = Symbol()
  const cache = []
  const state = []

  function next(agenda) {
    dispatcher.next(agenda
        .share()
        .subscribeOn(Scheduler.asap))
  }

  function dispatch(action) {
    if (isPromise(action)) {
      next(Observable.fromPromise(action))
      return action
    }

    if (typeof action === 'function') {
      const res = action(x => {
        dispatcher.next(Observable.of(x))
      })

      if (isPromise(res)) {
        next(Observable.fromPromise(res))
      }

      return Promise.resolve(res)
    }

    dispatcher.next(Observable.of(action))
    return Promise.resolve(action)
  }

  function schedule(agenda) {
    next(agenda)
  }

  function getState(fn) {
    if (typeof fn[identifier] === 'number')
      return state[fn[identifier]]()

    console.error(`Function wasn't yet reduced and is therefore unknown.`)
  }

  function reduce(fn, init) {
    if (typeof fn[identifier] === 'number')
      return cache[fn[identifier]]

    let anchor = createState(fn, fn(init, kickstart))

    const store = new BehaviorSubject(anchor.state)

    dispatcher.subscribe(agenda => {
      let pastAnchor = null
      const bucket = []

      agenda.subscribe(action => {
        if (!pastAnchor) {
          pastAnchor = anchor
        }

        bucket.push(action)

        anchor = anchor.doNext(action)
        store.next(anchor.state)
      }, err => {
        console.error(err)

        if (pastAnchor) {
          filterActions(pastAnchor, x => bucket.indexOf(x) === 0)
          store.next(anchor.state)
        }
      })
    })

    fn[identifier] = cache.length

    state.push(store.getValue.bind(store))

    const output = store.distinctUntilChanged()
    cache.push(output)
    return output
  }

  return Object.assign(dispatcher.mergeAll(), {
    dispatch,
    schedule,
    getState,
    reduce
  })
}

