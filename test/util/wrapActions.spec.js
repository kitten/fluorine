import expect from 'expect'
import wrapActions from '../../src/util/wrapActions'

const action = { type: 'ACTION' }
function createAction() {
  return action
}

describe('wrapActions', () => {
  it('wraps an action creator', done => {
    const observer = {
      next(obj) {
        expect(obj, action).toBe(action)
        done()
      }
    }

    wrapActions(observer, createAction)()
  })

  it('wraps action creators in objects', done => {
    const observer = {
      next(obj) {
        expect(obj).toBe(action)
        done()
      }
    }

    const obj = wrapActions(observer, {
      createAction
    })

    obj.createAction()
  })

  it('wraps action creators in arrays', done => {
    const observer = {
      next(obj) {
        expect(obj).toBe(action)
        done()
      }
    }

    const [ doCreateAction ] = wrapActions(observer, [ createAction ])
    doCreateAction()
  })

  it('wraps action creators recursively', () => {
    const observer = {
      next(obj) {
        expect(obj).toBe(action)
      }
    }

    const obj = wrapActions(observer, {
      action: {
        action: [ createAction ]
      }
    }, true)

    obj.action.action[0]()
  })
})

