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

test.cb('reduces correctly', t => {
  t.plan(1)

  const dispatcher = createDispatcher()
  dispatcher
    .reduce(CounterStore)
    .bufferCount(4)
    .first()
    .subscribe(x => {
      t.same(x, [ 0, 1, 2, 3 ])
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next({ type: 'NOISE' }) // This should be ignored
  dispatcher.next(add)
  dispatcher.next(add)
  dispatcher.next(add)
})

test.cb('reduces stores that emit predictable results', t => {
  t.plan(4)

  const dispatcher = createDispatcher()
  Observable.zip(
    dispatcher.reduce(CounterStore),
    dispatcher.reduce(CounterStore)
  )
    .take(4)
    .subscribe(([ a, b ]) => {
      t.is(a, b)
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next(add)
  dispatcher.next(add)
  dispatcher.next(add)
})

