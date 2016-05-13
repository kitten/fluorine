import isObservable from '../util/isObservable'
import isPromise from '../util/isPromise'

export function createThunkMiddleware(...extraArgs) {
  return dispatcher => next => agenda => {
    if (typeof agenda === 'function') {
      const res = agenda(
        x => dispatcher.next(x),
        x => dispatcher.reduce(x),
        ...extraArgs
      )

      if (isObservable(res) || isPromise(res)) {
        return next(res)
      }

      return undefined
    }

    return next(agenda)
  }
}

export default createThunkMiddleware()

