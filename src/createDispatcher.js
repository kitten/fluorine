import {
  BehaviorSubject,
  ReplaySubject
} from 'rx'

export default function createDispatcher() {
  const dispatcher = new ReplaySubject()
  dispatcher.onNext({ type: '_INIT_' }) // Initialisation action

  const identifier = Symbol()
  const cache = []
  const state = []

  return Object.assign(dispatcher.asObservable(), {
    dispatch(action) {
      if (typeof action === 'function') {
        return Promise.resolve(
          action(res => {
            dispatcher.onNext(res)
          })
        ).then(res => {
          if (res && res.type) {
            dispatcher.onNext(res)
          }
          return res
        })
      }

      dispatcher.onNext(action)
      return Promise.resolve(action)
    },
    getState(fn) {
      if (typeof fn[identifier] === 'number')
        return state[fn[identifier]]()

      throw `Function wasn't yet reduced and is therefore unknown.`
    },
    reduce(fn, init = null) {
      if (typeof fn[identifier] === 'number')
        return cache[fn[identifier]]

      const store = new BehaviorSubject(init)
      const anon = store.asObservable()

      dispatcher
        .scan(fn, null)
        .distinctUntilChanged()
        .subscribe(x => store.onNext(x),
          err => {
            throw err
          })

      fn[identifier] = cache.length
      state.push(store.getValue.bind(store))
      cache.push(anon)

      return anon
    }
  })
}
