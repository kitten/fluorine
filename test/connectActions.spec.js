import expect from 'expect'
import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connectActions from '../src/decorators/connectActions'
import Provider from '../src/components/Provider'
import createDispatcher from '../src/createDispatcher'

const doSomething = () => ({
  type: 'DO_SOMETHING'
})

class Child extends Component {
  render() {
    return <div/>
  }
}

describe('connectActions', () => {
  it('passes wrapped actions in props', () => {
    const dispatcher = createDispatcher()
    const Tester = connectActions({
      doSomething
    })(Child)

    const wrapper = mount(
      <Provider dispatcher={dispatcher}>
        <Tester/>
      </Provider>
    )

    const child = wrapper.find(Child).first()
    expect(Object.keys(child.prop('actions'))).toEqual([ 'doSomething' ])
    expect(typeof child.prop('actions').doSomething).toBe('function')
  })
})

