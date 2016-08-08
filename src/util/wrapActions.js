import assert from './assert'

export default function wrapActions(observer, arg, wrapRecursively = false) {
  assert(typeof observer === 'object' && typeof observer.next === 'function',
    'Expected observer to be an object containing at least a next method.')

  const transform = fn => (...args) => observer.next(fn(...args))
  const wrap = (input, keys = []) => {
    if (typeof input === 'function') {
      return transform(input)
    }

    if (Array.isArray(input)) {
      return input.map((x, key) => {

        if (wrapRecursively) {
          return wrap(x, keys.concat(key))
        }

        assert(
          typeof x === 'function',
          `wrapActions: Expected a \`function\`${keys.length ? ' in ' + keys.toString() : ''} but got \`${typeof x}\`.`)

        return transform(x)
      })
    }

    if (typeof input === 'object') {
      return Object.keys(input).reduce((prev, key) => {
        if (input.hasOwnProperty(key)) {
          const x = input[key]

          if (wrapRecursively) {
            prev[key] = wrap(x, keys.concat(key))
          } else {
            assert(
              typeof x === 'function',
              `wrapActions: Expected a \`function\`${keys.length ? ' in ' + keys.toString() : ''} but got \`${typeof x}\`.`)

            prev[key] = transform(x)
          }
        }

        return prev
      }, {})
    }

    throw new Error(`wrapActions: Expected a \`function\`${keys.length ? ' in ' + keys.toString() : ''} but got \`${typeof x}\`.`)
  }

  return wrap(arg)
}

