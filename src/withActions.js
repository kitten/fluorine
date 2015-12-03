import React from 'react'
import assert from './util/assert'

export default function withActions(dispatcher, actions, prop = 'actions') {
  assert(typeof actions === 'object', 'Expected `actions` to be an Object.')
  return Child => class ActionContainer extends React.Component {
    render() {
      const _actions = {}
      for (let key in actions) {
        if (actions.hasOwnProperty(key)) {
          _actions[key] = (...arg) => dispatcher.dispatch(actions[key](...arg))
        }
      }

      const props = {}
      props[prop] = _actions
      return <Child {...Object.assign({}, this.props, props)}/>
    }
  }
}
