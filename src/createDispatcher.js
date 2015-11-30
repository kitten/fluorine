import {
  BehaviorSubject,
  ReplaySubject
} from 'rx'

export default function createDispatcher() {
  const dispatcher = new ReplaySubject()
  dispatcher.onNext(null) // Initialisation action

  const identifier = Symbol()
  const cache = []

  // Extend Observable with our Dispatcher methods
  const res = dispatcher.asObservable()
  const proto = Object.create(Object.getPrototypeOf(res))
  Object.setPrototypeOf(res, proto)

  proto.dispatch = action => {
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
  }

  proto.getState = fn => {
    if (typeof fn[identifier] === 'number')
      return cache[fn[identifier]].getValue()

    throw `Function wasn't yet reduced and is therefore unknown.`
  }

  proto.reduce =(fn, init = null) => {
    if (typeof fn[identifier] === 'number')
      return cache[fn[identifier]]

    const store = new BehaviorSubject(init)

    dispatcher
      .scan(fn)
      .distinctUntilChanged()
      .subscribe(store.onNext)

    fn[identifier] = cache.length
    cache.push(store)

    return store.asObservable()
  }

  return res
}
