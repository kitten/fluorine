import test from 'tape'
import createDispatcher from '../src/createDispatcher'

test('Dispatcher dispatch', t => {
  t.plan(1)

  const dispatcher = createDispatcher()
  const action = {
    type: 'Test'
  }

  dispatcher.dispatch(action)

  dispatcher
    .bufferWithCount(2)
    .subscribe(x => {
      t.deepEqual(x, [ null, action ])
    })
})

test('Dispatcher reduces correctly', t => {
  t.plan(2)

  const arr = [ 1, 2, 3 ]
  const dispatcher = createDispatcher()
  dispatcher.dispatch('NOISE') // This should be ignored

  const reducer = function (state, action) {
    if (state === null) {
      return 0
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
      t.deepEqual(x, [ 0, 1, 3, 6 ])
      t.equal(dispatcher.getState(reducer), 6)
    })

  // Finally dispatch data
  arr
    .map(x => ({
      type: 'ADD',
      payload: x
    }))
    .forEach(dispatcher.dispatch)
})

test('Dispatcher returns predictable references', t => {
  t.plan(2)

  const dispatcher = createDispatcher()

  const fnA = function (x) { return x }
  const fnB = function (x) { return x }

  t.equal(dispatcher.reduce(fnA), dispatcher.reduce(fnA))
  t.notEqual(dispatcher.reduce(fnA), dispatcher.reduce(fnB))
})

test('Dispatcher stores support multiple subscriptions with the same outcome', t => {
  t.plan(2)

  const dispatcher = createDispatcher()
  const fnA = function (x) { return x }

  dispatcher.reduce(fnA).subscribe(x => {
    t.equal(x, null)
  })

  dispatcher.reduce(fnA).subscribe(x => {
    t.equal(x, null)
  })
})
