import { Observable } from 'rxjs'

export default function isObservable(obj) {
  return typeof obj === 'object' && (
    typeof obj[Symbol.observable] === 'function' ||
    obj instanceof Observable
  )
}

