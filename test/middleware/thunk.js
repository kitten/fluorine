import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import createDispatcher from '../../lib/createDispatcher'
import thunk from '../../lib/middleware/thunk'
import isPromise from '../../lib/util/isPromise'

const init = { type: '_INIT_' }
const action = { type: 'Test' }

test.cb('accepts thunks', t => {
  t.plan(1)

  const dispatcher = createDispatcher({}, [ thunk ])
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

  dispatcher.next(next => {
    setTimeout(() => {
      next(action)
    })
  })
})

test.cb('accepts agenda-thunks', t => {
  t.plan(1)

  const reducer = (acc = 0, action) => action.type === 'add' ? acc + 1 : acc

  const dispatcher = createDispatcher({}, [ thunk ])
  dispatcher
    .reduce(reducer)
    .filter(x => x === 1)
    .first()
    .subscribe(x => {
      t.pass()
    }, err => {
      t.fail(err)
    }, () => {
      t.end()
    })

  dispatcher.next((_, reduce) => reduce(reducer)
    .first()
    .map(x => ({ type: 'add' })))
})

