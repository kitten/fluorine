import { Observable } from 'rxjs'
import isObservable from './util/isObservable'

export default function combineReducers(reducers) {
  const keys = Object.keys(reducers)

  return reduce => Observable.combineLatest(
    ...keys.map(key => {
      const reducer = reducers[key]
      if (isObservable(reducer)) {
        return reducer
      }

      return reduce(reducer)
    }),
    (...values) => values.reduce((acc, val, index) => {
      acc[keys[index]] = val
      return acc
    }, {})
  )
}

