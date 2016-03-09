import React, { Component } from 'react'
import assert from './util/assert'
import {
  Observable
} from '@reactivex/rxjs'

export default function withStore(store, prop = 'data') {
  return Child => class StoreContainer extends Component {
    constructor(props) {
      super(props)

      if (typeof store === 'function') {
        this.store = store(props)
      } else {
        this.store = store
      }

      assert(this.store instanceof Observable, 'Expected `store` to be an Observable.')

      this.state = {
        data: undefined
      }
    }

    subscribe() {
      if (this.sub) {
        this.sub.unsubscribe()
      }

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

    componentWillReceiveProps(newProps) {
      if (typeof store === 'function') {
        const newStore = store(newProps)

        if (newStore !== this.store) {
          this.store = newStore
          this.subscribe()
        }
      }
    }

    componentWillUnmount() {
      this.sub.unsubscribe()
    }

    render() {
      if (this.state.data === undefined) {
        return null
      }

      return (
        <Child {...this.props} {...{
          [prop]: this.state.data
        }}/>
      )
    }
  }
}
