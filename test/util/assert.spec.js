import expect from 'expect'
import assert from '../../src/util/assert'

describe('assert', () => {
  it('throws on faulty input', () => {
    expect(() => {
      assert(false, 'test')
    }).toThrow('test')
  })

  it('does not throw on truthy input', () => {
    expect(() => {
      assert(true, '')
    }).toNotThrow()
  })
})

