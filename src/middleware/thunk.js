import isObservable from '../util/isObservable'
import isPromise from '../util/isPromise'

export function createThunkMiddleware(...extraArgs) {
  return dispatcher => agenda => agenda.map(thunkish => {
    if (typeof thunkish === 'function') {
      const res = thunkish(
        x => dispatcher.next(x),
        x => dispatcher.reduce(x),
        ...extraArgs
      )

      if (isObservable(res) || isPromise(res)) {
        dispatcher.next(res)
      }

      return null
    }

    return thunkish
  })
}

export default createThunkMiddleware()

