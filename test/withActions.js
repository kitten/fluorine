import test from 'ava'
import React, { Component } from 'react'
import { mount } from 'enzyme'

import withActions from '../lib/withActions'
import createDispatcher from '../lib/createDispatcher'

const doSomething = () => ({
  type: 'DO_SOMETHING'
})

class Child extends Component {
  render() {
    return <div/>
  }
}

test('passes wrapped actions in props', t => {
  const dispatcher = createDispatcher()

  const Tester = withActions(dispatcher, {
    doSomething
  })(Child)

  const wrapper = mount(<Tester/>)
  const child = wrapper.find(Child).first()

  t.same(Object.keys(child.prop('actions')), [ 'doSomething' ])
  t.is(typeof child.prop('actions').doSomething, 'function')
})

test('wraps actions to correctly dispatch', t => {
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
      t.same(x, [ false, true ])
    })

  const Tester = withActions(dispatcher, {
    doSomething
  })(Child)

  const wrapper = mount(<Tester/>)
  wrapper.find(Child).first().prop('actions').doSomething()
})

