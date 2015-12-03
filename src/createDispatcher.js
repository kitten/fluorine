import {
  BehaviorSubject,
  ReplaySubject
} from 'rx'

export default function createDispatcher() {
  const dispatcher = new ReplaySubject()
  dispatcher.onNext(null) // Initialisation action

  const identifier = Symbol()
  const cache = []
  const state = []

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
        return res
      })
    }

    dispatcher.onNext(action)
    return Promise.resolve(action)
  }

  proto.getState = fn => {
    if (typeof fn[identifier] === 'number')
      return state[fn[identifier]]()

    throw `Function wasn't yet reduced and is therefore unknown.`
  }

  proto.reduce = (fn, init = null) => {
    if (typeof fn[identifier] === 'number')
      return cache[fn[identifier]]

    const store = new BehaviorSubject(init)
    const anon = store.asObservable()

    dispatcher
      .scan(fn)
      .distinctUntilChanged()
      .subscribe(x => store.onNext(x))

    fn[identifier] = cache.length
    state.push(store.getValue.bind(store))
    cache.push(anon)

    return anon
  }

  return res
}
