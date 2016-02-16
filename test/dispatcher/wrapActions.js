import createDispatcher from '../../src/createDispatcher'

const action = { type: 'ACTION' }
function createAction() {
  return action
}

describe('Dispatcher.wrapActions', () => {
  it('wraps an action creator', () => {
    const dispatcher = createDispatcher()

    dispatcher
      .bufferCount(1)
      .subscribe(x => {
        expect(x).toEqual([ action ])
      })

    dispatcher.wrapActions(createAction)()
  })

  it('wraps action creators in objects', () => {
    const dispatcher = createDispatcher()

    dispatcher
      .bufferCount(1)
      .subscribe(x => {
        expect(x).toEqual([ action ])
      })

    const obj = dispatcher.wrapActions({
      action: createAction
    })

    obj.action()
  })

  it('wraps an action creators in arrays', () => {
    const dispatcher = createDispatcher()

    dispatcher
      .bufferCount(1)
      .subscribe(x => {
        expect(x).toEqual([ action ])
      })

    dispatcher.wrapActions([createAction])[0]()
  })
})

