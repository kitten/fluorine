import expect from 'expect'
import { createState, filterActions } from '../../src/util/state'

function CounterStore(state = 0, action) {
  switch (action.type) {
    case 'ADD': return state + 1
    case 'SUBTRACT': return state - 1
    default: return state
  }
}

const action = { type: 'ADD' }
const anotherAction = { type: 'SUBTRACT' }

describe('state', () => {
  it('tracks changing state in a linked list', () => {
    let anchor = createState(CounterStore, 1)

    expect(anchor.state).toBe(1)
    expect(anchor.action).toBe(undefined)

    anchor = anchor.doNext(action)

    expect(anchor.state).toBe(2)
    expect(anchor.action).toBe(action)
  })

  it('recomputes state filtering with a predicate', () => {
    const anchor = createState(CounterStore, 1)
    let state = anchor

    expect(anchor.state).toBe(1)
    expect(anchor.action).toBe(undefined)

    state = state.doNext(action)

    expect(state.state).toBe(2)
    expect(state.action).toBe(action)

    state = state.doNext(anotherAction)

    expect(state.state).toBe(1)
    expect(state.action).toBe(anotherAction)

    filterActions(anchor, x => x !== anotherAction)

    expect(state.state).toBe(2)
  })
})

