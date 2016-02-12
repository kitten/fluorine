import React from 'react'
import assert from './util/assert'
import {
  Observable
} from 'rxjs'

export default function withStore(store, prop = 'data') {
  return Child => class StoreContainer extends React.Component {
    constructor(props) {
      super(props)

      if (typeof store === 'function') {
        this.store = store(props)
      } else {
        this.store = store
      }

      assert(this.store instanceof Observable, 'Expected `store` to be an Observable.')

      this.state = {
        data: null
      }
    }

    componentWillMount() {
      this.sub = this.store.subscribe(next => {
        this.setState({
          data: next
        })
      }, err => {
        throw err
      })
    }

    componentWillReceiveProps(newProps) {
      if (typeof store === 'function') {
        const newStore = store(newProps)
        if (newStore !== this.store) {
          this.sub.unsubscribe()
          this.sub = newStore.subscribe(next => {
            this.setState({
              data: next
            })
          }, err => {
            throw err
          })
        }
      }
    }

    componentWillUnmount() {
      this.sub.unsubscribe()
    }

    render() {
      if (this.state.data === null) return null

      const props = {}
      props[prop] = this.state.data
      return <Child {...Object.assign({}, this.props, props)}/>
    }
  }
}
