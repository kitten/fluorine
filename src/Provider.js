import React, { Component } from 'react'
import assert from './util/assert'
import isObservable from './util/isObservable'

export default class Provider extends Component {
  static propTypes = {
    observable: React.PropTypes.object.isRequired
  };

  static childContextTypes = {
    dispatcher: React.PropTypes.object
  };

  getChildContext() {
    assert(isObservable(this.props.observable), 'Expect prop observable to be an observable.')
    return { observable: this.props.observable }
  }

  render() {
    return this.props.children
  }
}
