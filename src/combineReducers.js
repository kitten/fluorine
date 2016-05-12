import { Observable } from '@reactivex/rxjs'

export default function combineReducers(reducers) {
  const keys = Object.keys(reducers)

  return reduce => Observable.combineLatest(
    ...keys.map(key => reduce(reducers[key])),
    (...values) => values.reduce((acc, val, index) => {
      acc[keys[index]] = val
      return acc
    }, {})
  )
}

