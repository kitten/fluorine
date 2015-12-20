import React, { Component, PropTypes } from 'react'
import { withStore, withActions } from 'fluorine-lib'

import dispatcher from '../dispatcher'
import counter from '../reducers/counter'
import * as CounterActions from '../actions/counter'

@withStore(dispatcher.reduce(counter), 'counter')
@withActions(dispatcher, CounterActions)

export default class Counter extends Component {
  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    counter: PropTypes.number.isRequired
  }

  render() {
    const {
      counter,
      actions
    } = this.props

    return (
      <p>
        Clicked: {counter} times
        {' '}
        <button onClick={() => actions.increment()}>
          +
        </button>
        {' '}
        <button onClick={() => actions.decrement()}>
          -
        </button>
        {' '}
        <button onClick={() => actions.incrementAsync()}>
          Increment async
        </button>
      </p>
    )
  }
}
