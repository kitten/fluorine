import { map } from 'rxjs/operator/map'
import isObservable from '../util/isObservable'
import isPromise from '../util/isPromise'

export function createThunkMiddleware(...extraArgs) {
  return dispatcher => agenda => agenda::map(thunkish => {
    if (typeof thunkish === 'function') {
      const res = thunkish(
        dispatcher.next.bind(dispatcher),
        dispatcher.reduce.bind(dispatcher),
        ...extraArgs)

      if (isObservable(res) || isPromise(res)) {
        dispatcher.next(res)
      }

      return null
    }

    return thunkish
  })
}

export default createThunkMiddleware()

