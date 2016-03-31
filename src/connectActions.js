import React, { Component } from 'react'
import wrapActions from './util/wrapActions'

export default function connectActions(actions, prop = 'actions') {
  return Child => class Connector extends Component {
    static contextTypes = {
      observer: React.PropTypes.object
    }

    constructor(props, context = {}) {
      super(props, context)
      const { observer } = context
      this.actions = wrapActions(observer, actions)
    }

    shouldComponentUpdate(props, state) {
      for (const key in props) {
        if (props.hasOwnProperty(key) && props[key] !== this.props[key]) {
          return true
        }
      }

      return false
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

