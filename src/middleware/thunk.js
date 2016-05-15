import { Observable } from '@reactivex/rxjs'
import isObservable from '../util/isObservable'
import isPromise from '../util/isPromise'

export function createThunkMiddleware(...extraArgs) {
  return dispatcher => agenda => agenda.flatMap(x => {
    if (typeof agenda === 'function') {
      const res = agenda(
        y => dispatcher.next(y),
        y => dispatcher.reduce(y),
        ...extraArgs
      )

      if (isObservable(res)) {
        return res
      } else if (isPromise(res)) {
        return Observable.fromPromise(res)
      }

      return Observable.empty()
    }

    return x
  })
}

export default createThunkMiddleware()

