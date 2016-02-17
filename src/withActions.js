import React, { Component } from 'react'

export default function withActions(dispatcher, actions, prop = 'actions') {
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
