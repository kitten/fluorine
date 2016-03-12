import React, { Component } from 'react'
import assert from './util/assert'
import isObservable from './util/isObservable'
import isDispatcher from './util/isDispatcher'

export default function connect(selector, prop = 'data') {
  return Child => class Connector extends Component {
    static contextTypes = {
      observable: React.PropTypes.object.isRequired
    }

    constructor(props) {
      super(props)

      const { observable } = this.context
      assert(isObservable(observable), 'Expected context to contain an observable.')

      this.store = typeof selector === 'function' ?
        selector(observable, props) :
        selector
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
        const { observable } = this.context
        const _store = selector(observable, props)

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
      const { observable } = this.context
      const { data } = this.state

      if (data === undefined) {
        return null
      }

      const props = {
        [prop]: data
      }

      if (isDispatcher(obervable)) {
        props.dispatcher = observable
        props.schedule = observable.schedule
        props.dispatch = observable.dispatch
      }

      return (
        <Child {...this.props} {...props}/>
      )
    }
  }
}

