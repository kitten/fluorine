import expect from 'expect'
import React, { Component } from 'react'
import { Observable } from 'rxjs'
import { mount } from 'enzyme'

import connectStore from '../src/decorators/connectStore'
import createDispatcher from '../src/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

describe('connectStore', () => {
  it('passes the correct static observable value', () => {
    const Tester = connectStore(Observable.of('test'))(Child)
    const wrapper = mount(<Tester/>)

    expect(wrapper.text()).toBe('test')
  })

  it('passes selector-applied observable value based on props', () => {
    const Tester = connectStore((_, { test }) => Observable.of(test))(Child)
    const wrapper = mount(<Tester test='hello world'/>)

    expect(wrapper.text()).toBe('hello world')
  })

  it('subscribes to state and updates children', done => {
    const something = Observable.of({ type: 'DO_SOMETHING' })
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
      .subscribe(x => {
        expect(wrapper.text()).toBe(x)
      }, err => {
        throw err
      }, () => {
        done()
      })

    dispatcher.next(something.concat(something))
    dispatcher.next(something.concat(something))
    dispatcher.complete()
  })

  it('recomputes selector-applied observables on changing props', () => {
    const data = { a: 'a', b: 'b' }
    const Tester = connectStore((_, { id }) => Observable.of(data[id]))(Child)

    const wrapper = mount(<Tester id='a'/>)
    expect(wrapper.text()).toBe('a')
    wrapper.setProps({ id: 'b' })
    expect(wrapper.text()).toBe('b')
  })

  it('renders null if observable state is undefined', () => {
    const Tester = connectStore(Observable.of(undefined))(Child)

    const wrapper = mount(<Tester/>)
    expect(wrapper.isEmpty()).toExist
  })
})

