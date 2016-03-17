import React, { Component } from 'react'

import assert from './util/assert'
import isObservable from './util/isObservable'
import isDispatcher from './util/isDispatcher'

export default function connect(selector, propName) {
  return Child => class Connector extends Component {
    static contextTypes = {
      observable: React.PropTypes.object,
      observer: React.PropTypes.object
    }

    constructor(props, context = {}) {
      super(props, context)
      const { observer, observable } = context

      assert(typeof selector === 'function' || isObservable(selector),
        'Expected selector to be either a function or an observable.')

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

      const props = { [propName]: data }

      return (
        <Child
          {...this.props}
          {...props}
          observer={this.context.observer}/>
      )
    }
  }
}

