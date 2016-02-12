import {
  BehaviorSubject,
  ReplaySubject,
  Observable
} from 'rxjs'

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

export default function createDispatcher() {
  const dispatcher = new ReplaySubject()
  dispatcher.next(init) // Initialisation agenda

  const identifier = Symbol()
  const cache = []
  const state = []

  return Object.assign(dispatcher.mergeAll(), {
    dispatch(action) {
      if (typeof action === 'function') {
        const res = action(x => {
          dispatcher.next(Observable.of(x))
        })

        if (Promise.isPrototypeOf(res)) {
          dispatcher.next(
            Observable
              .fromPromise(res)
              .publishReplay()
          )
        }

        return Promise.resolve(res)
      }

      if (Promise.isPrototypeOf(action)) {
        dispatcher.next(
          Observable
            .fromPromise(action)
            .publishReplay()
        )
        return action
      }

      dispatcher.next(Observable.of(action))
      return Promise.resolve(action)
    },
    schedule(agenda) {
      dispatcher.next(agenda.publishReplay())
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
          store.next(anchor.state)
        }, err => {
          console.error(err)
          if (pastAnchor) {
            const restored = rewriteHistory(pastAnchor, x => bucket.indexOf(x) === 0)
            store.next(restored)
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
