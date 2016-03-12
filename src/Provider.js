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
    const { observable } = this.props
    assert(isObservable(observable), 'Expected prop observable to be an Observable.')
    return { observable }
  }

  render() {
    return this.props.children
  }
}
