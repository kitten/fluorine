export default function isIterator(arg) {
  return typeof arg[Symbol.iterator] === 'function'
}

