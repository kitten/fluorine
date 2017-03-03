import symbolObservable from 'symbol-observable'

export default function isObservable(obj) {
  return (
    obj &&
    typeof obj.subscribe === 'function' &&
    typeof obj[symbolObservable] === 'function'
  )
}
