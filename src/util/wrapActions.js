import assert from './assert'

export default function wrapActions(observer, arg) {
  assert(typeof observer === 'object' && typeof observer.next === 'function',
    'Expected observer to be an object containing at least a next method.')

  const transform = fn => (...args) => observer.next(fn(...args))

  if (typeof arg === 'function') {
    return transform(arg)
  }

  if (Array.isArray(arg)) {
    return arg.map(fn => {
      assert(typeof fn === 'function', 'Expected array to contain exclusively functions.')
      return transform(fn)
    })
  }

  if (typeof arg === 'object') {
    return Object.keys(arg).reduce((prev, key) => {
      if (arg.hasOwnProperty(key)) {
        const fn = arg[key]
        assert(typeof fn === 'function', 'Expected object to contain exclusively functions.')
        prev[key] = transform(fn)
      }

      return prev
    }, {})
  }

  throw new Error('Expected either an action creator or an array/object containing some as arguments.')
}

