import test from 'ava'
import React, { Component } from 'react'
import { mount } from 'enzyme'

import withStore from '../lib/withStore'
import createDispatcher from '../lib/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

test('passes the correct reductions', t => {
  const something = {
    type: 'DO_SOMETHING'
  }

  const reducer = (state, action) => {
    if (!state) {
      state = 'NOTHING'
    }

    switch (action.type) {
      case 'DO_SOMETHING': return 'SOMETHING'
      default: return state
    }
  }

  const dispatcher = createDispatcher()
  const Tester = withStore(dispatcher.reduce(reducer))(Child)

  const wrapper = mount(<Tester/>)

  dispatcher
    .reduce(reducer)
    .take(2)
    .subscribe(x => {
      t.is(wrapper.text(), x)
      t.is(wrapper.state('data'), x)
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })

  dispatcher.dispatch(something)
})

test('recompute dynamically generated observables', t => {
  const reducer = () => {
    return { a: 'a', b: 'b' }
  }

  const dispatcher = createDispatcher()

  const Tester = withStore(({id}) => dispatcher
    .reduce(reducer)
    .map(x => x[id]))
    (Child)

  class Switcher extends Component {
    constructor(props) {
      super(props)
      this.state = {
        id: 'a'
      };
    }

    render() {
      return <Tester id={this.state.id}/>
    }
  }

  const wrapper = mount(<Switcher/>)

  dispatcher
    .reduce(reducer)
    .first()
    .subscribe(() => {
      t.is(wrapper.text(), 'a')

      tree.setState({ id: 'b' })
      t.is(wrapper.text(), 'b')
    }, err => {
      t.fail()
    }, () => {
      t.end()
    })
})

