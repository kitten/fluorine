import expect from 'expect'
import createDispatcher from '../../src/createDispatcher'

import { of } from 'rxjs/observable/of'
import { mergeAll } from 'rxjs/operator/mergeAll'

const init = { type: '_INIT_' }
const action = { type: 'Test' }

describe('dispatcher.next', () => {
  it('accepts actions', done => {
    const dispatcher = createDispatcher()

    dispatcher
      ::mergeAll()
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

  it('accepts promises', done => {
    const dispatcher = createDispatcher()

    dispatcher
      ::mergeAll()
      .subscribe(x => {
        expect(x).toBe(action)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(Promise.resolve(action))
    dispatcher.complete()
  })

  it('accepts observables', done => {
    const dispatcher = createDispatcher()

    dispatcher
      ::mergeAll()
      .subscribe(x => {
        expect(x).toBe(action)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(of(action))
    dispatcher.complete()
  })
})

