import React, { Component } from 'react'
import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils'

import withActions from '../src/withActions'
import createDispatcher from '../src/createDispatcher'

const doSomething = () => ({
  type: 'DO_SOMETHING'
})

class Child extends Component {
  render() {
    return <div/>
  }
}

describe('withActions', () => {
  it('passes wrapped actions in props', t => {
    const dispatcher = createDispatcher()
    const Wrapper = withActions(dispatcher, {
      doSomething
    })(Child)

    const tree = renderIntoDocument(<Wrapper/>)
    const child = findRenderedComponentWithType(tree, Child)

    // Check for actions prop
    expect(
      child.props.actions &&
      typeof child.props.actions === 'object' &&
      child.props.actions.hasOwnProperty('doSomething') &&
      typeof child.props.actions.doSomething === 'function'
    ).toBeTruthy()

    // Check that actions only contains what we've passed
    expect(Object.keys(child.props.actions)).toEqual([ 'doSomething' ])
  })

  it('wraps actions to correctly dispatch', t => {
    const dispatcher = createDispatcher()
    const reducer = (state, action) => {
      if (state === null || state === undefined) {
        state = false
      }

      switch (action.type) {
        case 'DO_SOMETHING': return true
        default: return state
      }
    }

    // Keep track of reducer state
    dispatcher
      .reduce(reducer)
      .bufferCount(2)
      .subscribe(x => {
        expect(x).toEqual([ false, true ])
      })

    const Wrapper = withActions(dispatcher, {
      doSomething
    })(Child)

    const tree = renderIntoDocument(<Wrapper/>)
    const child = findRenderedComponentWithType(tree, Child)

    // Dispatch action returned by doSomething
    child.props.actions.doSomething()
  })
})

