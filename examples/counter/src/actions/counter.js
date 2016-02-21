import { Observable } from '@reactivex/rxjs'

import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/counter'

import counter from '../reducers/counter'
import { reduce } from '../dispatcher'

export function increment() {
  return {
    type: INCREMENT_COUNTER
  }
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  }
}

// This is a traditional thunk, like Redux uses it
export function incrementDelayedThunk(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment())
    }, delay)
  }
}

// We create an observable emitting the action and delay
// it with an RxJS operator
export const incrementDelayedAgenda = (delay = 1000) => Observable
  .of(increment())
  .delay(delay)

// We don't need to write a factory for this observable as
// it doesn't need any outside variables
export const incrementIfOdd = reduce(counter)
  .first()
  .map(val => (val % 2 !== 0) ? increment() : null)

// This uses the incremention, but concats an error. This will
// trigger Fluorine to rollback the incremention.
export const incrementDelayedRollback = incrementDelayedAgenda()
  .concat(Observable
    .throw('Hello World!')
    .delay(1000) // Delay the error so we can observe the rollback
  )

