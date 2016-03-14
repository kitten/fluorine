import test from 'ava'

import createDispatcher from '../../lib/createDispatcher'

const action = { type: 'ACTION' }
function createAction() {
  return action
}

test('wraps an action creator', t => {
  t.plan(1)
  const dispatcher = createDispatcher()

  dispatcher
    .mergeAll()
    .first()
    .subscribe(x => {
      t.is(x, action)
    })

  dispatcher.wrapActions(createAction)()
})

test('wraps action creators in objects', t => {
  t.plan(1)
  const dispatcher = createDispatcher()

  dispatcher
    .mergeAll()
    .first()
    .subscribe(x => {
      t.is(x, action)
    })

  const obj = dispatcher.wrapActions({
    action: createAction
  })

  obj.action()
})

test('wraps action creators in arrays', t => {
  t.plan(1)
  const dispatcher = createDispatcher()

  dispatcher
    .mergeAll()
    .first()
    .subscribe(x => {
      t.is(x, action)
    })

  dispatcher.wrapActions([createAction])[0]()
})

