import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../lib/createDispatcher'
import isObservable from '../lib/util/isObservable'

const action = { type: 'Test' }

test.cb('is an Observable emitting agendas', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .first()
    .mergeAll()
    .subscribe(x => {
      t.is(x, action)
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next(action)
})

test.cb('is an Observer taking actions, promises and agendas', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .mergeAll()
    .take(3)
    .subscribe(x => {
      t.is(x, action)
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next(action)
  dispatcher.next(Promise.resolve(action))
  dispatcher.next(Observable.of(action))
})

