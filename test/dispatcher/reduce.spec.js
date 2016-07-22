import expect from 'expect'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../../src/createDispatcher'

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

describe('dispatcher.reduce', () => {
  it('reduces correctly', done => {
    const dispatcher = createDispatcher()

    dispatcher
      .reduce(CounterStore)
      .bufferCount(4)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 2, 3 ])
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next({ type: 'NOISE' }) // This should be ignored
    dispatcher.next(add)
    dispatcher.next(add)
    dispatcher.next(add)
    dispatcher.complete()
  })

  it('reduces stores that emit predictable results', done => {
    const dispatcher = createDispatcher()

    Observable.zip(
      dispatcher.reduce(CounterStore),
      dispatcher.reduce(CounterStore)
    )
      .take(4)
      .subscribe(([ a, b ]) => {
        expect(a).toBe(b)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(add)
    dispatcher.next(add)
    dispatcher.next(add)
    dispatcher.complete()
  })
})

