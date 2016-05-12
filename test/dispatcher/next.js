import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../../lib/createDispatcher'
import isPromise from '../../lib/util/isPromise'

const init = { type: '_INIT_' }
const action = { type: 'Test' }

test.cb('accepts actions', t => {
  t.plan(1)

  const dispatcher = createDispatcher()
  dispatcher
    .mergeAll()
    .filter(x => x === action)
    .first()
    .subscribe(x => {
      t.pass()
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next(action)
})

test.cb('accepts promises', t => {
  t.plan(1)

  const dispatcher = createDispatcher()
  dispatcher
    .mergeAll()
    .filter(x => x === action)
    .first()
    .subscribe(x => {
      t.pass()
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next(Promise.resolve(action))
})

test.cb('accepts observables', t => {
  t.plan(1)

  const dispatcher = createDispatcher()
  dispatcher
    .mergeAll()
    .filter(x => x === action)
    .first()
    .subscribe(x => {
      t.pass()
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next(Observable.of(action))
})

