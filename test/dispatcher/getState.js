import createDispatcher from '../../src/createDispatcher'

function CounterStore(state = 0, action) {
  switch (action.type) {
    case 'ADD': {
      return state + 1
      break
    }

    case 'SUBTRACT': {
      return state - 1
      break
    }

    default: return state
  }
}

const add = { type: 'ADD' }
const subtract = { type: 'SUBTRACT' }

describe('Dispatcher.getState', () => {
  it('returns the initial state', () => {
    const dispatcher = createDispatcher()

    dispatcher.reduce(CounterStore)
    expect(dispatcher.getState(CounterStore)).toEqual(0)
  })

  it('returns the up to date state', () => {
    const dispatcher = createDispatcher()

    dispatcher.reduce(CounterStore)

    dispatcher.dispatch(add)
    expect(dispatcher.getState(CounterStore)).toEqual(1)

    dispatcher.dispatch(add)
    expect(dispatcher.getState(CounterStore)).toEqual(2)

    dispatcher.dispatch(subtract)
    expect(dispatcher.getState(CounterStore)).toEqual(1)
  })
})
