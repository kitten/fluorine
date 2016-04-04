import React, { Component } from 'react'
import wrapActions from './util/wrapActions'

export default function withActions(observer, actions, prop = 'actions', wrapRecursively = true) {
  return Child => class ActionContainer extends Component {
    render() {
      return (
        <Child {...this.props} {...{
          [prop]: wrapActions(observer, actions, wrapRecursively)
        }}/>
      )
    }
  }
}
