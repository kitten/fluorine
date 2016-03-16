import React, { Component } from 'react'
import assert from './util/assert'
import isObservable from './util/isObservable'
import createDispatcher from './createDispatcher'

export default class Provider extends Component {
  static propTypes = {
    dispatcher: React.PropTypes.object,
    transform: React.PropTypes.func
  };

  static childContextTypes = {
    wrapActions: React.PropTypes.func,
    observable: React.PropTypes.object
  };

  constructor(props) {
    super(props)

    const dispatcher = props.dispatcher ? props.dispatcher : createDispatcher()

    this.wrapActions = dispatcher.wrapActions
    this.observable = props.transform ? props.transform(dispatcher.reduce) : dispatcher
  }

  getChildContext() {
    const { wrapActions, observable } = this

    assert(isObservable(observable), 'Expected context.observable to be an Observable.')
    return { observable, wrapActions }
  }

  render() {
    return this.props.children
  }
}
