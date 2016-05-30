import test from 'ava'
import { Observable } from '@reactivex/rxjs'

import isObservable from '../../lib/util/isObservable'

test(t => {
  t.ok(isObservable(Observable.of('Value')))

  t.notOk(isObservable())
  t.notOk(isObservable({}))
  t.notOk(isObservable(() => {}))
})

