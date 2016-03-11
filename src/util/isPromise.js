export default function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

