import expect from 'expect'
import React, { Component } from 'react'
import { mount } from 'enzyme'

import withActions from '../src/decorators/withActions'
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
  it('passes wrapped actions in props', () => {
    const dispatcher = createDispatcher()

    const Tester = withActions(dispatcher, {
      doSomething
    })(Child)

    const wrapper = mount(<Tester/>)
    const child = wrapper.find(Child).first()

    expect(Object.keys(child.prop('actions'))).toEqual([ 'doSomething' ])
    expect(typeof child.prop('actions').doSomething).toBe('function')
  })
})

