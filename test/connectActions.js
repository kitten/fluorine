import test from 'ava'

import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connectActions from '../lib/decorators/connectActions'
import Provider from '../lib/components/Provider'
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
  const Tester = connectActions({
    doSomething
  })(Child)

  const wrapper = mount(
    <Provider dispatcher={dispatcher}>
      <Tester/>
    </Provider>
  )

  const child = wrapper.find(Child).first()
  t.same(Object.keys(child.prop('actions')), [ 'doSomething' ])
  t.is(typeof child.prop('actions').doSomething, 'function')
})

