import * as $$observable from 'symbol-observable'
import { Observable } from '@reactivex/rxjs'

export default function isObservable(obj) {
  return typeof obj === 'object' && (
    typeof obj[$$observable] === 'function' ||
    obj instanceof Observable
  )
}

