export default function isObservable(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.subscribe === 'function'
  )
}

