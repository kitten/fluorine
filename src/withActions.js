import React, { Component } from 'react'
import warn from './util/warn'

const _withActionsNotice = warn('The `withActions` decorator is deprecated. Please use `connect` instead.')

export default function withActions(dispatcher, actions, prop = 'actions') {
  _withActionsNotice()

  return Child => class ActionContainer extends Component {
    render() {
      return (
        <Child {...this.props} {...{
          [prop]: dispatcher.wrapActions(actions)
        }}/>
      )
    }
  }
}
