import test from 'ava'

import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connect from '../lib/connect'
import createDispatcher from '../lib/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

// connect tested in combination with the Provider is in
// the Provider test file

test('passes the correct static observable value', t => {
  const Tester = connect(Observable.of('test'))(Child)

  const wrapper = mount(<Tester/>)

  t.is(wrapper.text(), 'test')
  t.is(wrapper.state('data'), 'test')
})

test('passes selector-applied observable value based on props', t => {
  const Tester = connect((_, { test }) => Observable.of(test))(Child)

  const wrapper = mount(<Tester test='hello world'/>)

  t.is(wrapper.text(), 'hello world')
  t.is(wrapper.state('data'), 'hello world')
})

test('subscribes to state and updates children', t => {
  const something = { type: 'DO_SOMETHING' }

  const reducer = (state = 'NOTHING', action) => {
    switch (action.type) {
      case 'DO_SOMETHING': return state + 'X'
      default: return state
    }
  }

  const dispatcher = createDispatcher()
  const Tester = connect(() => dispatcher.reduce(reducer))(Child)

  const wrapper = mount(<Tester/>)

  dispatcher
    .reduce(reducer)
    .take(3)
    .subscribe(x => {
      t.is(wrapper.text(), x)
      t.is(wrapper.state('data'), x)
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })

  dispatcher.dispatch(something)
  dispatcher.dispatch(something)
})

test('recomputes selector-applied observables on changing props', t => {
  const data = { a: 'a', b: 'b' }

  const Tester = connect((_, {id}) => Observable.of(data[id]))(Child)

  const wrapper = mount(<Tester id='a'/>)

  t.is(wrapper.text(), 'a')
  wrapper.setProps({ id: 'b' })
  t.is(wrapper.text(), 'b')
})

