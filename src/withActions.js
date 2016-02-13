import React, { Component } from 'react'
import assert from './util/assert'

export default function withActions(dispatcher, actions, prop = 'actions') {
  assert(typeof actions === 'object', 'Expected `actions` to be an Object.')

  const { dispatch } = dispatcher

  const _actions = {}
  for (let key in actions) {
    if (actions.hasOwnProperty(key)) {
      const action = actions[key]
      _actions[key] = typeof action === 'function' ?
        (...args) => dispatch(action(...args)) :
        () => dispatch(action)
    }
  }

  return Child => class ActionContainer extends Component {
    render() {
      return (
        <Child {...this.props} {...{
          [prop]: _actions
        }}/>
      )
    }
  }
}
