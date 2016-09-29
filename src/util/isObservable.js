import _Symbol from 'es6-symbol'
import { Observable } from 'rxjs'

export default function isObservable(obj) {
  return obj && (
    typeof obj[_Symbol.observable] === 'function' ||
    obj instanceof Observable
  )
}

