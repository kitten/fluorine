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

describe('Dispatcher.reduce', () => {
  it('reduces correctly', () => {
    const dispatcher = createDispatcher()
    dispatcher.dispatch('NOISE') // This should be ignored

    dispatcher
      .reduce(CounterStore)
      .bufferCount(4)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 2, 3 ])
      })

    dispatcher.dispatch(add)
    dispatcher.dispatch(add)
    dispatcher.dispatch(add)
  })

  it('returns predictable references', t => {
    const dispatcher = createDispatcher()

    const fnA = function (x) { return x }
    const fnB = function (x) { return x }

    expect(dispatcher.reduce(fnA)).toBe(dispatcher.reduce(fnA))
    expect(dispatcher.reduce(fnB)).toBe(dispatcher.reduce(fnB))
    expect(dispatcher.reduce(fnA)).toNotBe(dispatcher.reduce(fnB))
  })

  it('stores support multiple subscriptions with the same outcome', t => {
    const dispatcher = createDispatcher()
    const fnA = function (w, x) { return x }

    dispatcher.reduce(fnA).subscribe(x => {
      expect(x.type).toBe('_INIT_')
    })

    dispatcher.reduce(fnA).subscribe(x => {
      expect(x.type).toBe('_INIT_')
    })
  })

})
