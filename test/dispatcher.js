import createDispatcher from '../src/createDispatcher'
import { Observable } from '@reactivex/rxjs'

const action = { type: 'Test' }

function isObservable(obj) {
  return (
    typeof obj === 'object' &&
    typeof obj.subscribe === 'function'
  )
}

describe('Dispatcher', () => {
  it('is an Observable emitting agendas', () => {
    const dispatcher = createDispatcher()
    const first = dispatcher
      .first()
      .publishReplay()

    expect(first.every(x => isObservable(x))).toBeTruthy()

    first
      .mergeAll()
      .subscribe(x => expect(x).toEqual(action))

    dispatcher.dispatch(action)
  })

  it('is an Observer taking actions, thunks, promises and agendas', () => {
    const dispatcher = createDispatcher()
    const first = dispatcher
      .first()
      .publishReplay()

    expect(first.every(x => isObservable(x))).toBeTruthy()

    first
      .mergeAll()
      .subscribe(x => expect(x).toEqual(action))

    Observable
      .of(
        action, // action
        dispatch => dispatch(action), // thunk
        Promise.resolve(action), // promise
        Observable.of(action) // agenda
      ).subscribe(dispatcher.next)
  })
})
