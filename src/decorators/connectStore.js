import React, { Component } from 'react'

import assert from '../util/assert'
import isObservable from '../util/isObservable'
import isDispatcher from '../util/isDispatcher'

export default function connectStore(selector, prop = 'data', pureProps = true) {
  assert(typeof selector === 'function' || isObservable(selector),
    'Expected selector to be either a function or an observable.')

  return Child => class Connector extends Component {
    static contextTypes = {
      observable: React.PropTypes.object,
      observer: React.PropTypes.object
    }

    constructor(props, context = {}) {
      super(props, context)
      const { observer, observable } = context

      this.store = (
        typeof selector === 'function' ?
        selector(observable, props) :
        selector
      )

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
      if (!pureProps || state.data !== this.state.data) {
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
      const { observer } = this.context
      const { data } = this.state

      if (process.env.NODE_ENV !== 'production' && data === undefined) {
        console.error('Rendering `undefined` causes undefined behaviour in most cases! This message will only show up in development.')
      }

      return React.createElement(Child, {
        ...this.props,
        [prop]: data,
        observer
      })
    }
  }
}

