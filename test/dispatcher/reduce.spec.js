import expect from 'expect'
import { Observable } from 'rxjs'

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

  it('reverts changes after an error is thrown', done => {
    const dispatcher = createDispatcher()

    dispatcher
      .reduce(CounterStore)
      .bufferCount(3)
      .subscribe(([ a, b, c ]) => {
        expect(a).toBe(0)
        expect(b).toBe(1)
        expect(c).toBe(0)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(Observable
      .of(add)
      .concat(Observable.throw(new Error('Test'))))
    dispatcher.complete()
  })

  it('reverts changes without changing other states', done => {
    const dispatcher = createDispatcher()
    const TestStore = (state = 'quo') => 'quo'

    dispatcher
      .reduce(TestStore)
      .subscribe(x => {
        expect(x).toBe('quo')
      }, err => {
        throw err
      })

    dispatcher
      .reduce(CounterStore)
      .bufferCount(3)
      .subscribe(([ a, b, c ]) => {
        expect(a).toBe(0)
        expect(b).toBe(1)
        expect(c).toBe(0)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(Observable
      .of(add)
      .concat(Observable.throw(new Error('Test'))))
    dispatcher.complete()
  })

})

