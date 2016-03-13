import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../../lib/createDispatcher'
import isPromise from '../../lib/util/isPromise'

function AdderStore(state = 0, action) {
  switch (action.type) {
    case 'ADD': {
      return state + 1
      break
    }

    default: return state
  }
}

function SubtractorStore(state = 0, action) {
  switch (action.type) {
    case 'SUBTRACT': {
      return state - 1
      break
    }

    default: return state
  }
}

const add = { type: 'ADD' }
const subtract = { type: 'SUBTRACT' }

test('accepts observables to schedule an agenda', t => {
  const dispatcher = createDispatcher()

  const addThree = Observable
    .interval(200)
    .take(3)
    .map(() => add)

  dispatcher.schedule(addThree)
  dispatcher.schedule(Observable.of(subtract), Observable.of(subtract))

  dispatcher
    .reduce(AdderStore)
    .bufferCount(6)
    .subscribe(x => {
      t.same(x, [ 0, 1, 2, 3, 2, 1 ])
    })
})

test('accepts connectable observables properly', t => {
  const dispatcher = createDispatcher()

  const obs = Observable
    .interval(200)
    .take(3)
    .map(() => add)
    .share()

  dispatcher.schedule(obs)
  dispatcher.schedule(obs)

  dispatcher
    .reduce(AdderStore)
    .bufferCount(4)
    .subscribe(x => {
      t.same(x, [ 0, 1, 2, 3 ])
    })
})

test('reverts changes if an agenda fails', t => {
  const dispatcher = createDispatcher()

  dispatcher.schedule(Observable
    .interval(200)
    .take(2)
    .map(() => add)
    .concat(Observable.throw()))

  dispatcher
    .reduce(AdderStore)
    .bufferCount(4)
    .subscribe(x => {
      t.same(x, [ 0, 1, 2, 0 ])
    })
})

test('reverts without touching unaffected states', t => {
  const dispatcher = createDispatcher()

  dispatcher.schedule(Observable
    .interval(250)
    .take(2)
    .map(() => add)
    .concat(Observable.throw()))

  dispatcher.schedule(Observable
    .interval(100)
    .take(5)
    .map(() => subtract))

  dispatcher
    .reduce(AdderStore)
    .bufferCount(4)
    .subscribe(x => {
      t.same(x, [ 0, 1, 2, 0 ])
    })

  dispatcher
    .reduce(SubtractorStore)
    .bufferCount(6)
    .subscribe(x => {
      t.same(x, [ 0, -1, -2, -3, -4, -5 ])
    })
})

