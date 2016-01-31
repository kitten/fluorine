import createDispatcher from '../src/createDispatcher'

describe('Dispatcher', () => {
  it('dispatch', t => {
    const dispatcher = createDispatcher()
    const action = {
      type: 'Test'
    }

    dispatcher.dispatch(action)

    dispatcher
      .bufferWithCount(2)
      .subscribe(x => {
        expect(x).toEqual([ { type: '_INIT_' }, action ])
      })
  })

  it('reduces correctly', t => {
    const arr = [ 1, 2, 3 ]
    const dispatcher = createDispatcher()
    dispatcher.dispatch('NOISE') // This should be ignored

    const reducer = function (state, action) {
      if (!state) {
        state = 0
      }

      if (action.type === 'ADD') {
        return state + action.payload
      }

      return state
    }

    dispatcher
      .reduce(reducer)
      .bufferWithCount(4)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 3, 6 ])
        expect(dispatcher.getState(reducer)).toBe(6)
      })

    // Finally dispatch data
    arr
      .map(x => ({
        type: 'ADD',
        payload: x
      }))
      .forEach(dispatcher.dispatch)
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

