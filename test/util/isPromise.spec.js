import expect from 'expect'
import isPromise from '../../src/util/isPromise'

describe('isPromise', () => {
  it('differentiates between Promises and non-promises', () => {
    expect(isPromise(new Promise((resolve, reject) => {
      resolve('Value')
    }))).toExist()

    expect(isPromise(Promise.resolve('Value'))).toExist()
    expect(isPromise({
      then: () => {}
    })).toExist()

    expect(isPromise()).toNotExist()
    expect(isPromise({})).toNotExist()
    expect(isPromise(() => {})).toNotExist()
  })
})
