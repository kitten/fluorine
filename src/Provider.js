import React, { Component } from 'react'

import assert from './util/assert'
import createDispatcher from './createDispatcher'

function isDispatcher(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.subscribe === 'function' &&
    typeof obj.reduce === 'function' &&
    typeof obj.schedule === 'function'
  )
}

export default class Provider extends Component {
  static propTypes = {
    dispatcher: React.PropTypes.object
  };

  static childContextTypes = {
    dispatcher: React.PropTypes.object
  };

  getChildContext() {
    if (this.props.dispatcher) {
      assert(isDispatcher(this.props.dispatcher), 'Expected a Dispatcher to be passed in the dispatcher prop.')
      return { dispatcher: this.props.dispatcher }
    }

    if (!this.dispatcher) {
      this.dispatcher = createDispatcher()
    }

    return { dispatcher: this.dispatcher }
  }

  render() {
    return this.props.children
  }
}
