import test from 'ava'
import React, { Component } from 'react'
import { mount } from 'enzyme'

import withStore from '../lib/withStore'
import createDispatcher from '../lib/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

// Basically an identical test to one in the connect
// tests but with the withStore signature

test('wraps around connect correctly', t => {
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
      t.is(wrapper.text(), 'a')

      wrapper.setProps({ id: 'b' })
      t.is(wrapper.text(), 'b')
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })
})

