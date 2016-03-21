# Functional Additions to Flux

Two functional additions to Flux, that came by way of Redux are stores and action creators.

## Stores

Stores are computed using **reducers**. They must be pure functions,
without side effects. They have the function
signature:

```js
(lastState, action) => nextState
```

- `lastState` is the last state, that was emitted by your store.
- `action` describes the mutation that should be made to your state.

This reducer returns the next state of your store based on the prior state. It's
up to the dispatcher to compute the consecutive states with each reduction.

```js
actions = [action1, action2, action3]
newState = actions.reduce(reducer, originalState)
```

This is very similar to RxJS's `scan` method.
[More info](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md)

More on the dispatcher and the stores will follow in
[Fully Reactive Dispatchers and Stores](#fully-reactive-dispatchers-and-stores)

Check out the [reducer in our Todo MVC Example](https://github.com/philpl/fluorine/blob/master/examples/todo/src/reducers/todo.js)
 to see a store in action.

## Action Creators

Actions are created by pure functions with the signature:

```js
(...args) => action
```

This is then called an action creator. This is a simplified design pattern
to keep your actions consistent and well-tested.

**Example**: Check out the [actions in the Todo MVC Example](https://github.com/philpl/fluorine/blob/master/examples/todo/src/actions/todo.js).

