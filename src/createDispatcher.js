import {
  BehaviorSubject,
  ReplaySubject,
  Observable
} from 'rx'

const _state = {
  doNext(action) {
    const { reducer } = this

    const nextState = reducer(this.state, action)
    if (nextState === this.state) {
      return this
    }

    this.next = Object.assign(Object.create(_state), {
      state: nextState,
      action,
      reducer
    })

    return this.next
  }
}

function rewriteHistory(pastAnchor, filter) {
  const { reducer } = pastAnchor
  let { state } = pastAnchor
  let anchor = pastAnchor

  while (anchor.next) {
    if (filter(anchor.next.action)) {
      // Recompute state
      anchor.next.state = reducer(anchor.state, anchor.next.action)
    } else {
      // Erase filtered action from history
      anchor.next.state = anchor.state
      anchor.next.action = {}
    }

    state = anchor.next.state
    anchor = anchor.next
  }

  return state
}

const init = Observable
  .of({ type: '_INIT_' })
  .shareReplay()

export default function createDispatcher() {
  const dispatcher = new ReplaySubject()
  dispatcher.onNext(init) // Initialisation agenda

  const identifier = Symbol()
  const cache = []
  const state = []

  return Object.assign(dispatcher.asObservable(), {
    dispatch(action) {
      if (typeof action === 'function') {
        const res = action(x => {
          dispatcher.onNext(Observable.of(x))
        })

        if (Promise.isPrototypeOf(res)) {
          dispatcher.onNext(
            Observable
              .fromPromise(res)
              .shareReplay()
          )
        }

        return Promise.resolve(res)
      }

      if (Promise.isPrototypeOf(action)) {
        dispatcher.onNext(
          Observable
            .fromPromise(action)
            .shareReplay()
        )
        return action
      }

      dispatcher.onNext(Observable.of(action))
      return Promise.resolve(action)
    },
    schedule(agenda) {
      dispatcher.onNext(agenda.shareReplay())
      return Promise.resolve(agenda)
    },
    getState(fn) {
      if (typeof fn[identifier] === 'number')
        return state[fn[identifier]]()

      throw `Function wasn't yet reduced and is therefore unknown.`
    },
    reduce(fn, init) {
      if (typeof fn[identifier] === 'number')
        return cache[fn[identifier]]

      const store = new BehaviorSubject(init)

      let anchor = Object.assign(Object.create(_state), {
        reducer: fn,
        state: init
      })

      dispatcher.subscribe(agenda => {
        let pastAnchor = null
        const bucket = []

        agenda.subscribe(action => {
          if (!pastAnchor) {
            pastAnchor = anchor
          }
          bucket.push(action)
          anchor = anchor.doNext(action)
          store.onNext(anchor.state)
        }, err => {
          console.error(err)
          if (pastAnchor) {
            const restored = rewriteHistory(pastAnchor, x => bucket.indexOf(x) === 0)
            store.onNext(restored)
          }
        })
      })

      fn[identifier] = cache.length
      state.push(store.getValue.bind(store))

      const output = store.distinctUntilChanged()
      cache.push(output)
      return output
    }
  })
}
