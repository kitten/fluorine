import test from 'ava'
import React, { Component } from 'react'
import { mount } from 'enzyme'

import withActions from '../lib/decorators/withActions'
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

