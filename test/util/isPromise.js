import test from 'ava'

import isPromise from '../../lib/util/isPromise'

test(t => {
  t.ok(isPromise(new Promise((resolve, reject) => {
    resolve('Value')
  })))
  t.ok(isPromise(Promise.resolve('Value')))
  t.ok(isPromise({
    then: () => {}
  }))

  t.notOk(isPromise())
  t.notOk(isPromise({}))
  t.notOk(isPromise(() => {}))
})
