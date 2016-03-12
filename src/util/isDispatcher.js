export default function isDispatcher(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.dispatch === 'function' &&
    typeof obj.schedule === 'function' &&
    typeof obj.reduce === 'function'
  )
}
