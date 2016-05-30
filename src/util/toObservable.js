import { Observable } from '@reactivex/rxjs'
import isPromise from './isPromise'
import isObservable from './isObservable'
import isIterator from './isIterator'

export default function toObservable(arg) {
  if (isObservable(arg)) {
    return Observable.from(arg)
  } else if (isIterator(arg)) {
    return Observable.from(arg)
  } else if (isPromise(arg)) {
    return Observable.fromPromise(arg)
  }

  return Observable.of(arg)
}

