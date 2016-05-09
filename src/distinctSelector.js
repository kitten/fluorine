import { Observable } from '@reactivex/rxjs'
import assert from './util/assert'

export default function distinctSelector(keys) {
  const _containsStrings = keys.reduce((acc, str) => acc && typeof str === 'string', true)
  assert(Array.isArray(keys), 'Expected `keys` to be an array.')
  assert(_containsStrings, 'Expected `keys` to contain only keys.')

  return Observable.create(observer => {
    let last = undefined
    return this.subscribe(
      value => {
        if (value === undefined || value === null || last === value) {
          return
        }

        let changed = false
        const result = {}

        for (const key of keys) {
          result[key] = value[key]
          if (!changed || !last || result[key] !== last[key]) {
            changed = true
          }
        }

        if (changed) {
          observer.next(result)
        }

        last = value
      },
      err => observer.error(err),
      () => observer.complete())
  })
}
