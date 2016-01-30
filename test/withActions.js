import test from 'tape'
import React from 'react'
import {
  createRenderer,
  findRenderedComponentWithType
} from 'react-addons-test-utils'

import withActions from '../src/withActions'
import createDispatcher from '../src/createDispatcher'

const doSomething = () => ({
  type: 'DO_SOMETHING'
})

function Child() {
  return <div/>
}


test('withActions passes wrapped actions in props', t => {
  const renderer = createRenderer()

  const dispatcher = createDispatcher()
  const Wrapper = withActions(dispatcher, {
    doSomething
  })(Child)

  renderer.render(<Wrapper/>)
  const tree = renderer.getRenderOutput()

  t.equal(tree.type, Child)

  // Check for actions prop
  t.ok(
    tree.props.actions &&
    typeof tree.props.actions === 'object' &&
    tree.props.actions.hasOwnProperty('doSomething') &&
    typeof tree.props.actions.doSomething === 'function'
  )

  // Check that actions only contains what we've passed
  const actionKeys = Object.keys(tree.props.actions)
  t.deepEqual(actionKeys, ['doSomething'])

  t.end()
})

test('withActions wrapped actions dispatch', t => {
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

  const renderer = createRenderer()
  renderer.render(<Wrapper/>)
  const tree = renderer.getRenderOutput()

  // Dispatch action returned by doSomething
  tree.props.actions.doSomething()

  t.equal(dispatcher.getState(reducer), true)
  t.end()
})
