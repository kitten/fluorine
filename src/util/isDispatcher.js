import isObservable from './isObservable'

export default function isDispatcher(obj) {
  return (
    isObservable(obj) &&
    typeof obj.next === 'function' &&
    typeof obj.reduce === 'function'
  )
}
