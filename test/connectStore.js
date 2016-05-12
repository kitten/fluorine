import test from 'ava'

import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connectStore from '../lib/connectStore'
import createDispatcher from '../lib/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

test('passes the correct static observable value', t => {
  const Tester = connectStore(Observable.of('test'))(Child)
  const wrapper = mount(<Tester/>)

  t.is(wrapper.text(), 'test')
})

test('passes selector-applied observable value based on props', t => {
  const Tester = connectStore((_, { test }) => Observable.of(test))(Child)
  const wrapper = mount(<Tester test='hello world'/>)

  t.is(wrapper.text(), 'hello world')
})

test.cb('subscribes to state and updates children', t => {
  t.plan(2)

  const something = { type: 'DO_SOMETHING' }
  const reducer = (state = 'NOTHING', action) => {
    switch (action.type) {
      case 'DO_SOMETHING': return state + 'X'
      default: return state
    }
  }

  const dispatcher = createDispatcher()
  const Tester = connectStore(() => dispatcher.reduce(reducer))(Child)
  const wrapper = mount(<Tester/>)

  dispatcher
    .reduce(reducer)
    .take(2)
    .subscribe(x => {
      t.is(wrapper.text(), x)
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })

  dispatcher.next(something)
  dispatcher.next(something)
})

test('recomputes selector-applied observables on changing props', t => {
  const data = { a: 'a', b: 'b' }
  const Tester = connectStore((_, {id}) => Observable.of(data[id]))(Child)
  const wrapper = mount(<Tester id='a'/>)

  t.is(wrapper.text(), 'a')
  wrapper.setProps({ id: 'b' })
  t.is(wrapper.text(), 'b')
})

