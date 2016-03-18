import React, { Component, PropTypes } from 'react'
import { connectStore, wrapActions } from 'fluorine-lib'

import counter from '../reducers/counter'

import {
  increment,
  decrement,
  incrementDelayedThunk,
  incrementDelayedAgenda,
  incrementIfOdd,
  incrementDelayedRollback
} from '../actions/counter'

@connectStore(({ reduce }) => reduce(counter), 'counter')
export default class Counter extends Component {
  render() {
    const {
      observer,
      counter
    } = this.props

    const action = wrapActions(observer, {
      increment,
      decrement,
      incrementDelayedThunk
    })

    return (
      <div>
        <p>
          Clicked: {counter} times
        </p>

        <div>
          <button onClick={() => action.increment()}>
            +
          </button>

          <button onClick={() => action.decrement()}>
            -
          </button>

          <button onClick={() => action.incrementDelayedThunk()}>
            Increment async (thunk)
          </button>

          <br/>

          <button onClick={() => observer.next(incrementDelayedAgenda())}>
            Increment async (agenda)
          </button>

          <button onClick={() => observer.next(incrementIfOdd)}>
            Increment if odd
          </button>

          <button onClick={() => observer.next(incrementDelayedRollback)}>
            Increment async and rollback
          </button>

        </div>
      </div>
    )
  }
}
