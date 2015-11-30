import {
  BehaviorSubject,
  ReplaySubject
} from 'rx'

export default function createDispatcher() {
  const dispatcher = ReplaySubject()
  dispatcher.onNext(null)

  const identifier = Symbol()
  const cache = []

  return {
    dispatch(action) {
      if (typeof action === 'function') {
        return Promise.resolve(
          action(res => {
            dispatcher.onNext(res)
          })
        ).then(res => {
          dispatcher.onNext(res)
        })
      }

      dispatcher.onNext(action)
    },

    getState(fn) {
      if (typeof fn[identifier] === 'number')
        return cache[fn[identifier]].getValue()

      throw `Function wasn't yet reduced and is therefore unknown.`
    },

    reduce(fn, init = null) {
      if (typeof fn[identifier] === 'number')
        return cache[fn[identifier]]

      const store = BehaviorSubject(init)

      dispatcher
        .scan(fn)
        .distinctUntilChanged()
        .subscribe(store.onNext)

      fn[identifier] = cache.length
      cache.push(store)

      return store.asObservable()
    },

    stream: dispatcher.asObservable()
  }
}
