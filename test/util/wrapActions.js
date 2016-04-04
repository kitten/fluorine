import test from 'ava'

import wrapActions from '../../lib/util/wrapActions'

const action = { type: 'ACTION' }
function createAction() {
  return action
}

test.cb('wraps an action creator', t => {
  t.plan(1)

  const observer = {
    next(obj) {
      t.is(obj, action)
      t.end()
    }
  }

  wrapActions(observer, createAction)()
})

test.cb('wraps action creators in objects', t => {
  t.plan(1)

  const observer = {
    next(obj) {
      t.is(obj, action)
      t.end()
    }
  }

  const obj = wrapActions(observer, {
    createAction
  })

  obj.createAction()
})

test.cb('wraps action creators in arrays', t => {
  t.plan(1)

  const observer = {
    next(obj) {
      t.is(obj, action)
      t.end()
    }
  }

  const [ doCreateAction ] = wrapActions(observer, [ createAction ])
  doCreateAction()
})

test.cb('wraps action creators recursively', t => {
  t.plan(2)

  const observer = {
    next(obj) {
      t.is(obj, action)
      t.end()
    }
  }

  const obj = wrapActions(observer, {
    a: [ createActions ],
    b: { action: createAction }
  })

  obj.a[0]()
  obj.b.action()
})

