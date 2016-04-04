import assert from './assert'

export default function wrapActions(observer, arg, wrapRecursively = false) {
  assert(typeof observer === 'object' && typeof observer.next === 'function',
    'Expected observer to be an object containing at least a next method.')

  const transform = fn => (...args) => observer.next(fn(...args))
  const wrap = input => {
    if (typeof input === 'function') {
      return transform(input)
    }

    if (Array.isArray(input)) {
      return input.map(x => {

        if (wrapRecursively) {
          wrap(x);
        }

        assert(typeof x === 'function', 'Expected array to contain exclusively functions. Did you intend to use wrapActions recursively?')
        return transform(x)
      })
    }

    if (typeof input === 'object') {
      return Object.keys(input).reduce((prev, key) => {
        if (input.hasOwnProperty(key)) {
          const x = input[key]

          if (wrapRecursively) {
            prev[key] = wrap(x)
          }

          assert(typeof x === 'function', 'Expected object to contain exclusively functions.')
          prev[key] = transform(x)
        }

        return prev
      }, {})
    }

    throw new Error('Expected either an action creator or an array/object containing some as arguments.')
  }

  return wrap(arg)
}

