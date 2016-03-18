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

test.cb('is an Observer taking actions, thunks, promises and agendas', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .mergeAll()
    .take(4)
    .subscribe(x => {
      t.is(x, action)
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  Observable
    .of(
      action, // action
      next => { next(action) }, // thunk
      Promise.resolve(action), // promise
      Observable.of(action) // agenda
    ).subscribe(dispatcher.next)
})

