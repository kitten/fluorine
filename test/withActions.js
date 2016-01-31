import React from 'react'
import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils'

import withActions from '../src/withActions'
import createDispatcher from '../src/createDispatcher'

const doSomething = () => ({
  type: 'DO_SOMETHING'
})

function Child() {
  return <div/>
}

describe('withActions', () => {
  it('passes wrapped actions in props', t => {
    const dispatcher = createDispatcher()
    const Wrapper = withActions(dispatcher, {
      doSomething
    })(Child)

    const tree = renderIntoDocument(<Wrapper/>)
    console.log(tree)

    expect(tree.type).toBe(Child)

    // Check for actions prop
    expect(
      tree.props.actions &&
      typeof tree.props.actions === 'object' &&
      tree.props.actions.hasOwnProperty('doSomething') &&
      typeof tree.props.actions.doSomething === 'function'
    ).toBeTruthy()

    // Check that actions only contains what we've passed
    expect(Object.keys(tree.props.actions)).toEqual([ 'doSomething' ])
  })

  it('wraps actions to correctly dispatch', t => {
    const dispatcher = createDispatcher()
    const reducer = (state = false, action) => {
      switch (action.type) {
        case 'DO_SOMETHING': return true
        default: return state
      }
    }

    // Keep track of reducer state
    dispatcher.reduce(reducer)

    const Wrapper = withActions(dispatcher, {
      doSomething
    })(Child)

    const tree = renderIntoDocument(<Wrapper/>)

    // Dispatch action returned by doSomething
    tree.props.actions.doSomething()

    expect(dispatcher.getState(reducer)).toBe(true)
  })
})

