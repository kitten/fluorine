import distinctSelector from './distinctSelector'
import { Observable } from '@reactivex/rxjs'
Observable.prototype.distinctSelector = distinctSelector

import createDispatcher from './createDispatcher'
import withActions from './withActions'
import withStore from './withStore'
import connectStore from './connectStore'
import connectActions from './connectActions'
import wrapActions from './util/wrapActions'
import Provider from './Provider'
import combineReducers from './combineReducers'

export {
  createDispatcher,
  withActions,
  withStore,
  connectStore,
  connectActions,
  wrapActions,
  Provider,
  distinctSelector,
  combineReducers
}
