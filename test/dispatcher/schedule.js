import createDispatcher from '../../src/createDispatcher'
import isPromise from '../../src/util/isPromise'
import { Observable } from 'rxjs'


function AdderStore(state = 0, action) {
  switch (action.type) {
    case 'ADD': {
      return state + 1
      break
    }

    default: return state
  }
}

function SubtractorStore(state = 0, action) {
  switch (action.type) {
    case 'SUBTRACT': {
      return state - 1
      break
    }

    default: return state
  }
}

const add = { type: 'ADD' }
const subtract = { type: 'SUBTRACT' }

describe('Dispatcher.schedule', () => {
  it('accepts observables to schedule an agenda', () => {
    const dispatcher = createDispatcher()

    const addThree = Observable
      .interval(200)
      .take(3)
      .map(() => add)

    dispatcher.schedule(addThree)
    dispatcher.schedule(Observable.of(subtract), Observable.of(subtract))

    dispatcher
      .reduce(AdderStore)
      .bufferCount(6)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 2, 3, 2, 1 ])
      })
  })

  it('accepts connectable observables properly', () => {
    const dispatcher = createDispatcher()

    const obs = Observable
      .interval(200)
      .take(3)
      .map(() => add)
      .share()

    dispatcher.schedule(obs)
    dispatcher.schedule(obs)

    dispatcher
      .reduce(AdderStore)
      .bufferCount(4)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 2, 3 ])
      })
  })

  it('reverts changes if an agenda fails', () => {
    const dispatcher = createDispatcher()

    dispatcher.schedule(Observable
      .interval(200)
      .take(2)
      .map(() => add)
      .concat(Observable.throw()))

    dispatcher
      .reduce(AdderStore)
      .bufferCount(4)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 2, 0 ])
      })
  })

  it('reverts without touching unaffected states', () => {
    const dispatcher = createDispatcher()

    dispatcher.schedule(Observable
      .interval(250)
      .take(2)
      .map(() => add)
      .concat(Observable.throw()))

    dispatcher.schedule(Observable
      .interval(100)
      .take(5)
      .map(() => subtract))

    dispatcher
      .reduce(AdderStore)
      .bufferCount(4)
      .subscribe(x => {
        expect(x).toEqual([ 0, 1, 2, 0 ])
      })

    dispatcher
      .reduce(SubtractorStore)
      .bufferCount(6)
      .subscribe(x => {
        expect(x).toEqual([ 0, -1, -2, -3, -4, -5 ])
      })
  })
})

