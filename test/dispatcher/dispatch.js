import createDispatcher from '../../src/createDispatcher'
import isPromise from '../../src/util/isPromise'

const init = { type: '_INIT_' }
const action = { type: 'Test' }

describe('Dispatcher.dispatch', () => {
  it('accepts actions', () => {
    const dispatcher = createDispatcher()

    dispatcher
      .bufferCount(2)
      .subscribe(x => {
        expect(x).toEqual([ init, action ])
      })

    const res = dispatcher.dispatch(action)

    // Check whether the dispatcher returns a Promise
    expect(isPromise(res)).toBeTruthy()
    res.then(x => {
      expect(x).toEqual(action)
    })


  })

  it('accepts thunks', () => {
    const dispatcher = createDispatcher()

    dispatcher
      .bufferCount(2)
      .subscribe(x => {
        expect(x).toEqual([ init, action ])
      })

    const res = dispatcher.dispatch(dispatch => {
      setTimeout(() => {
        dispatch(action)
      })
    })

    expect(isPromise(res)).toBeTruthy()
  })

  it('accepts promises', () => {
    const dispatcher = createDispatcher()

    dispatcher
      .bufferCount(2)
      .subscribe(x => {
        expect(x).toEqual([ init, action ])
      })

    const res = dispatcher.dispatch(new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(action)
      })
    }))

    expect(isPromise(res)).toBeTruthy()
    res.then(x => {
      expect(x).toEqual(action)
    })


  })

})

