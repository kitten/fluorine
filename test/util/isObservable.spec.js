import expect from 'expect'
import { Observable } from '@reactivex/rxjs'

import isObservable from '../../src/util/isObservable'

describe('isObservable', () => {
  it('differentiates between Observables and non-observables', () => {
    expect(isObservable(Observable.of('Value'))).toExist()

    expect(isObservable()).toNotExist()
    expect(isObservable({})).toNotExist()
    expect(isObservable(() => {})).toNotExist()
  })
})

