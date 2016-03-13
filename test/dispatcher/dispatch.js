import test from 'ava'

import createDispatcher from '../../lib/createDispatcher'
import isPromise from '../../lib/util/isPromise'

const init = { type: '_INIT_' }
const action = { type: 'Test' }

test('accepts actions', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .bufferCount(2)
    .subscribe(x => {
      t.same(x, [ init, action ])
    })

  const res = dispatcher.dispatch(action)

  t.ok(isPromise(res))
  res.then(x => {
    t.is(x, action)
  })
})

test('accepts thunks', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .bufferCount(2)
    .subscribe(x => {
      t.same(x, [ init, action ])
    })

  const res = dispatcher.dispatch(dispatch => {
    setTimeout(() => {
      dispatch(action)
    })
  })

  t.ok(isPromise(res))
  res.then(x => {
    t.is(x, action)
  })
})

test('accepts promises', t => {
  const dispatcher = createDispatcher()

  dispatcher
    .bufferCount(2)
    .subscribe(x => {
      t.same(x, [ init, action ])
    })

  const res = dispatcher.dispatch(new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(action)
    })
  }))

  t.ok(isPromise(res))
  res.then(x => {
    t.is(x, action)
  })
})

