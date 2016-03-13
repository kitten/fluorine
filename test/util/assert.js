import test from 'ava'
import assert from '../../lib/util/assert'

test(t => {
  t.throws(() => {
    assert(false, 'test')
  }, 'test')
})

test(t => {
  t.notThrows(() => {
    assert(true, '')
  })
})

