import { of } from 'rxjs/observable/of'
import { from } from 'rxjs/observable/from'
import isPromise from './isPromise'
import isObservable from './isObservable'

export default function toObservable(arg) {
  if (isObservable(arg) || isPromise(arg)) {
    return from(arg)
  }

  return of(arg)
}

