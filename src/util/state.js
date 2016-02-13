const _state = {
  doNext(action) {
    const { reducer } = this

    const nextState = reducer(this.state, action)
    if (nextState === this.state) {
      return this
    }

    this.next = Object.assign(Object.create(_state), {
      state: nextState,
      action,
      reducer
    })

    return this.next
  }
}

export function createState(reducer, init) {
  return Object.assign(Object.create(_state), {
    reducer,
    state: init
  })
}

export function filterActions(start, filter) {
  const { reducer } = start
  let anchor = start

  while (anchor.next) {
    if (filter(anchor.next.action)) {
      // Recompute state
      anchor.next.state = reducer(anchor.state, anchor.next.action)
    } else {
      // Erase filtered action from history
      anchor.next.state = anchor.state
      anchor.next.action = {}
    }

    anchor = anchor.next
  }
}
