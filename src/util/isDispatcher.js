import { Dispatcher } from '../createDispatcher'

export default function isDispatcher(obj) {
  return Dispatcher.prototype.isPrototypeOf(obj)
}
