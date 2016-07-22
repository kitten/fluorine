import expect from 'expect'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../src/createDispatcher'
import isObservable from '../src/util/isObservable'

const action = { type: 'Test' }

describe('dispatcher', () => {
  it('is an Observable emitting agendas', done => {
    const dispatcher = createDispatcher()

    dispatcher
      .mergeAll()
      .subscribe(x => {
        expect(x).toBe(action)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(action)
    dispatcher.complete()
  })

  it('is an Observer taking actions, promises and agendas', done => {
    const dispatcher = createDispatcher()

    dispatcher
      .mergeAll()
      .subscribe(x => {
        expect(x).toBe(action)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(action)
    dispatcher.next(Promise.resolve(action))
    dispatcher.next(Observable.of(action))
    dispatcher.complete()
  })
})

