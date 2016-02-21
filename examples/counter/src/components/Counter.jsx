import React, { Component } from 'react'
import { withStore, withActions } from 'fluorine-lib'

import dispatcher, { reduce, schedule } from '../dispatcher'
import counter from '../reducers/counter'

import {
  increment,
  decrement,
  incrementDelayedThunk,
  incrementDelayedAgenda,
  incrementIfOdd,
  incrementDelayedRollback
} from '../actions/counter'

@withStore(reduce(counter), 'counter')
@withActions(dispatcher, {
  increment,
  decrement,
  incrementDelayedThunk
})

export default class Counter extends Component {
  render() {
    const {
      counter,
      actions
    } = this.props

    const {
      increment,
      decrement,
      incrementDelayedThunk
    } = actions

    return (
      <div>
        <p>
          Clicked: {counter} times
        </p>

        <div>
          <button onClick={() => increment()}>
            +
          </button>

          <button onClick={() => decrement()}>
            -
          </button>

          <button onClick={() => incrementDelayedThunk()}>
            Increment async (thunk)
          </button>

          <br/>

          <button onClick={() => schedule(incrementDelayedAgenda())}>
            Increment async (agenda)
          </button>

          <button onClick={() => schedule(incrementIfOdd)}>
            Increment if odd
          </button>

          <button onClick={() => schedule(incrementDelayedRollback)}>
            Increment async and rollback
          </button>

        </div>
      </div>
    )
  }
}
