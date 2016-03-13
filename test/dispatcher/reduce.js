import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../../lib/createDispatcher'

function CounterStore(state = 0, action) {
  switch (action.type) {
    case 'ADD': {
      return state + 1
      break
    }

    case 'SUBTRACT': {
      return state - 1
      break
    }

    default: return state
  }
}

const add = { type: 'ADD' }
const subtract = { type: 'SUBTRACT' }

test('reduces correctly', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .reduce(CounterStore)
    .bufferCount(4)
    .first()
    .subscribe(x => {
      t.same(x, [ 0, 1, 2, 3 ])
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })

  dispatcher.dispatch({ type: 'NOISE' }) // This should be ignored
  dispatcher.dispatch(add)
  dispatcher.dispatch(add)
  dispatcher.dispatch(add)
})

test('reduces stores that emit predictable results', t => {
  const dispatcher = createDispatcher()

  Observable.zip(
    dispatcher.reduce(CounterStore),
    dispatcher.reduce(CounterStore)
  )
    .take(4)
    .filter(([ a, b ]) => a === b)
    .subscribe(x => {
      t.pass()
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })

  dispatcher.dispatch({ type: 'NOISE' }) // This should be ignored
  dispatcher.dispatch(add)
  dispatcher.dispatch(add)
  dispatcher.dispatch(add)
})

test('returns predictable references', t => {
  t.plan(3)

  const dispatcher = createDispatcher()

  const fnA = function (x) { return x }
  const fnB = function (x) { return x }

  t.is(dispatcher.reduce(fnA), dispatcher.reduce(fnA))
  t.is(dispatcher.reduce(fnB), dispatcher.reduce(fnB))
  t.not(dispatcher.reduce(fnA), dispatcher.reduce(fnB))
})

