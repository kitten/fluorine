import React from 'react'
import assert from './util/assert'
import {
  Observable
} from 'rx'

export default function withStore(store, prop = 'data') {
  assert(store instanceof Observable, 'Expected `store` to be an Observable.')
  return Child => class StoreContainer extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null
      }
    }

    componentWillMount() {
      this.sub = store.subscribe(next => {
        this.setState({
          data: next
        })
      }, err => {
        console.error(err)
      })
    }

    componentWillUnmount() {
      this.sub.dispose()
    }

    render() {
      if (this.state.data === null) return null

      const props = {}
      props[prop] = this.state.data
      return <Child {...Object.assign({}, this.props, props)}/>
    }
  }
}
