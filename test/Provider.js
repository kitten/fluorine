import test from 'ava'

import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connect from '../lib/connect'
import Provider from '../lib/Provider'

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

