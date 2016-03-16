import React, { Component } from 'react'
import assert from './util/assert'
import isObservable from './util/isObservable'
import isDispatcher from './util/isDispatcher'

export default function connect(selector, actions) {
  return Child => class Connector extends Component {
    static contextTypes = {
      observable: React.PropTypes.object,
      wrapActions: React.PropTypes.func
    }

    constructor(props, context = {}) {
      super(props, context)
      const { wrapActions, observable } = context

      this.store = (
        typeof selector === 'function' ?
        selector(observable, props) :
        selector
      )

      if (wrapActions && typeof actions === 'function') {
        this.actions = actions(wrapActions)
      } else if (wrapActions) {
        this.actions = wrapActions(actions)
      } else if (typeof actions === 'function') {
        throw new Error('Selector function was passed to connect, but there is no Provider')
      } else {
        this.actions = wrapActions(actions)
      }

      this.state = {}
    }

    subscribe = () => {
      this.sub = this.store.subscribe(next => {
        this.setState({
          data: next
        })
      }, err => {
        throw err
      })
    }

    componentWillMount() {
      this.subscribe()
    }

    shouldComponentUpdate(props, state) {
      if (state.data !== this.state.data) {
        return true
      }

      for (const key in props) {
        if (props.hasOwnProperty(key) && props[key] !== this.props[key]) {
          return true
        }
      }

      return false
    }

    componentWillReceiveProps(props) {
      if (typeof selector === 'function') {
        const _store = selector(this.context.observable, props)

        if (this.store !== _store) {
          this.store = _store
          this.sub.unsubscribe()
          this.subscribe()
        }
      }
    }

    componentWillUnmount() {
      this.sub.unsubscribe()
    }

    render() {
      const { data } = this.state

      if (data === undefined) {
        return null
      }

      if (
        this.context &&
        this.context.observable &&
        isDispatcher(this.context.observable)
      ) {
        props.dispatcher = this.context.observable
      }

      return (
        <Child {...this.props} {...this.actions} {...data}/>
      )
    }
  }
}

