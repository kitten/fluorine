import React, { Component } from 'react'
import wrapActions from './util/wrapActions'

export default function connectActions(actions, prop = 'actions', wrapRecursively = true) {
  return Child => class Connector extends Component {
    static contextTypes = {
      observer: React.PropTypes.object
    }

    constructor(props, context = {}) {
      super(props, context)
      const { observer } = context
      this.actions = wrapActions(observer, actions, wrapRecursively)
    }

    render() {
      const props = { [prop]: this.actions }

      return (
        <Child
          {...this.props}
          {...props}
          observer={this.context.observer}/>
      )
    }
  }
}

