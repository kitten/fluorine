import _Symbol from 'es6-symbol'

export default function isIterator(arg) {
  return arg && typeof arg[_Symbol.iterator] === 'function'
}

