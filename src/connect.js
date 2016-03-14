import React, { Component } from 'react'
import assert from './util/assert'
import isObservable from './util/isObservable'
import isDispatcher from './util/isDispatcher'

export default function connect(selector, prop = 'data') {
  return Child => class Connector extends Component {
    static contextTypes = {
      observable: React.PropTypes.object
    }

    constructor(props, context = {}) {
      super(props, context)

      this.store = typeof selector === 'function' ?
        selector(this.context.observable, props) :
        selector

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

      const props = {
        [prop]: data
      }

      if (
        this.context &&
        this.context.observable &&
        isDispatcher(this.context.obervable)
      ) {
        props.schedule = this.context.observable.schedule
        props.dispatch = this.context.observable.dispatch
      }

      return (
        <Child {...this.props} {...props}/>
      )
    }
  }
}

