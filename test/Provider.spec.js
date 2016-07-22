import expect from 'expect'
import React, { Component } from 'react'
import { Observable } from '@reactivex/rxjs'
import { mount } from 'enzyme'

import connectStore from '../src/decorators/connectStore'
import Provider from '../src/components/Provider'

function Child({data}) {
  return <div>{data}</div>
}

describe('Provider', () => {
  it('passes the observable down to connect', () => {
    const Tester = connectStore(observable => observable.map(x => `${x} world`))(Child)

    const wrapper = mount(
      <Provider observable={Observable.of('hello')}>
        <Tester/>
      </Provider>
    )

    const testerWrapper = wrapper.find(Tester).first()
    expect(testerWrapper.text()).toBe('hello world')
  })
})

