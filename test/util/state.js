import test from 'ava'

import { createState, filterActions } from '../../lib/util/state'

function CounterStore(state = 0, action) {
  switch (action.type) {
    case 'ADD': return state + 1
    case 'SUBTRACT': return state - 1
    default: return state
  }
}

const action = { type: 'ADD' }
const anotherAction = { type: 'SUBTRACT' }

test('tracks changing state in a linked list', t => {
  let anchor = createState(CounterStore, 1)

  t.is(anchor.state, 1)
  t.ok(anchor.action === undefined)

  anchor = anchor.doNext(action)

  t.is(anchor.state, 2)
  t.is(anchor.action, action)
})

test('recomputes state filtering with a predicate', t => {
  const anchor = createState(CounterStore, 1)
  let state = anchor

  t.is(anchor.state, 1)
  t.ok(anchor.action === undefined)

  state = state.doNext(action)

  t.is(state.state, 2)
  t.is(state.action, action)

  state = state.doNext(anotherAction)

  t.is(state.state, 1)
  t.is(state.action, anotherAction)

  filterActions(anchor, x => x !== anotherAction)

  t.is(state.state, 2)
})

