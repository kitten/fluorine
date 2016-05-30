import React, { Component, PropTypes } from 'react'

import assert from '../util/assert'
import isObservable from '../util/isObservable'
import isDispatcher from '../util/isDispatcher'

import createDispatcher from '../createDispatcher'

export default class Provider extends Component {
  static propTypes = {
    dispatcher: PropTypes.object,
    observable: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object
    ])
  };

  static childContextTypes = {
    observer: React.PropTypes.object,
    observable: React.PropTypes.object
  };

  constructor(props) {
    super(props)
    let { dispatcher } = props
    const { observable } = props

    if (!dispatcher) {
      dispatcher = createDispatcher()
    } else {
      assert(isDispatcher(dispatcher), 'Expected prop dispatcher to be a Dispatcher.')
    }

    this.observer = {
      next: dispatcher.next,
      error: dispatcher.error,
      complete: dispatcher.complete
    }

    if (observable && typeof observable === 'function') {
      this.observable = observable(dispatcher)
    } else if (isObservable(observable)) {
      this.observable = observable
    } else {
      this.observable = dispatcher
    }

    assert(isObservable(this.observable), 'Expected provided observable to be an Observable.')
  }

  getChildContext() {
    const { observer, observable } = this
    return { observer, observable }
  }

  render() {
    return this.props.children
  }
}
