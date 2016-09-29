import symbolObservable from 'es6-symbol'
import { Observable } from 'rxjs'

export default function isObservable(obj) {
  return obj && (
    typeof obj[symbolObservable] === 'function' ||
    obj instanceof Observable
  )
}

