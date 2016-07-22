import expect from 'expect'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../../src/createDispatcher'
import thunk from '../../src/middleware/thunk'
import isPromise from '../../src/util/isPromise'

const init = { type: '_INIT_' }
const action = { type: 'Test' }

describe('thunk middleware', () => {
  it('accepts thunks', done => {
    const dispatcher = createDispatcher({}, [ thunk ])

    dispatcher
      .mergeAll()
      .subscribe(x => {
        expect(x).toBe(action)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(nexdone => {
      setTimeout(() => {
        next(action)
      })
    })
    dispatcher.complete()
  })

  it('accepts agenda-thunks', done => {
    const reducer = (acc = 0, action) => action.type === 'add' ? acc + 1 : acc
    const dispatcher = createDispatcher({}, [ thunk ])

    dispatcher
      .reduce(reducer)
      .last()
      .subscribe(x => {
        expect(x).toBe(1)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next((_, reduce) => reduce(reducer)
      .first()
      .map(x => ({ type: 'add' })))
    dispatcher.complete()
  })
})

