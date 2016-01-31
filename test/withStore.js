import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { renderIntoDocument } from 'react-addons-test-utils'

import withStore from '../src/withStore'
import createDispatcher from '../src/createDispatcher'

function Child({data}) {
  return <div>{data}</div>
}

describe('withStore', () => {
  it('passes the correct reductions', () => {
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

    const Wrapper = withStore(dispatcher.reduce(reducer))(Child)
    const tree = renderIntoDocument(<Wrapper/>)
    const node = findDOMNode(tree)

    dispatcher
      .reduce(reducer)
      .take(2)
      .subscribe(x => {
        expect(node.textContent).toBe(x)
        expect(tree.state.data).toBe(x)
      })

    dispatcher.dispatch(something)
  })

  it('recompute dynamically generated observables', () => {
    const reducer = () => {
      return { a: 'a', b: 'b' }
    }

    const dispatcher = createDispatcher()

    const Wrapper = withStore(({id}) => dispatcher
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
        return <Wrapper id={this.state.id}/>
      }
    }

    const tree = renderIntoDocument(<Switcher/>)
    const node = findDOMNode(tree)

    expect(node.textContent).toBe('a')

    tree.setState({ id: 'b' })

    expect(node.textContent).toBe('b')
  })
})

