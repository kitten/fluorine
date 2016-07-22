import expect from 'expect'
import React, { Component } from 'react'
import { mount } from 'enzyme'

import withStore from '../src/decorators/withStore'
import createDispatcher from '../src/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

// Basically an identical test to one in the connect
// tests but with the withStore signature

describe('withStore',  () => {
  it('wraps around connect correctly', done => {
    const reducer = () => {
      return { a: 'a', b: 'b' }
    }

    const dispatcher = createDispatcher()

    const Tester = withStore(({id}) => dispatcher
      .reduce(reducer)
      .map(x => x[id]))
      (Child)

    const wrapper = mount(<Tester id='a'/>)

    dispatcher
      .reduce(reducer)
      .first()
      .subscribe(() => {
        expect(wrapper.text()).toBe('a')
        wrapper.setProps({ id: 'b' })
        expect(wrapper.text()).toBe('b')
      }, err => {
        throw err
      }, () => {
        done()
      })
  })
})

