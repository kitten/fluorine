import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../lib/createDispatcher'
import isObservable from '../lib/util/isObservable'

const action = { type: 'Test' }

test('is an Observable emitting agendas', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .first()
    .every(x => isObservable(x))
    .subscribe(x => {
      t.ok(x)
    })

  dispatcher
    .first()
    .mergeAll()
    .subscribe(x => {
      t.is(x, action)
    })

  dispatcher.dispatch(action)
})

test('is an Observer taking actions, thunks, promises and agendas', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .take(4)
    .every(x => isObservable(x))
    .subscribe(x => {
      t.ok(x)
    })

  dispatcher
    .take(4)
    .mergeAll()
    .subscribe(x => {
      t.is(x, action)
    })

  Observable
    .of(
      action, // action
      dispatch => dispatch(action), // thunk
      Promise.resolve(action), // promise
      Observable.of(action) // agenda
    ).subscribe(dispatcher.next)
})

