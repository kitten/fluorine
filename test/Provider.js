import test from 'ava'

import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connect from '../lib/connect'
import Provider from '../lib/Provider'
import createDispatcher from '../lib/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

test('passes the observable down to connect', t => {
  const Tester = connect(observable => observable.map(x => `${x} world`))(Child)

  const wrapper = mount(
    <Provider observable={Observable.of('hello')}>
      <Tester/>
    </Provider>
  )

  const testerWrapper = wrapper.find(Tester).first()
  t.is(testerWrapper.text(), 'hello world')
})

test('connect passes dispatch, schedule and next', t => {
  t.plan(6)
  const dispatcher = createDispatcher()

  const Tester = connect(() => Observable.of('static'))(props => {
    t.is(typeof props.schedule, 'function')
    t.is(typeof props.dispatch, 'function')
    t.is(typeof props.next, 'function')

    t.is(props.schedule, dispatcher.schedule)
    t.is(props.dispatch, dispatcher.dispatch)
    t.is(props.next, dispatcher.next)

    return <div>{props.data}</div>
  })

  const wrapper = mount(
    <Provider observable={dispatcher}>
      <Tester/>
    </Provider>
  )
})

