import React from 'react'
import assert from './util/assert'

export default function withActions(dispatcher, actions, prop = 'actions') {
  assert(typeof actions === 'object', 'Expected `actions` to be an Object.')
  return Child => class ActionContainer extends React.Component {
    render() {
      const props = {}

      props[prop] = {}
      for (let key in actions) {
        if (actions.hasOwnProperty(key)) {
          props[prop] = action => dispatcher.dispatch(action)
        }
      }

      return <Child {...Object.assign({}, this.props, props)}/>
    }
  }
}
