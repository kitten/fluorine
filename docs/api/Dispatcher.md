# Dispatcher

A Dispatcher is an interface to the event stream of your application. You may
inject new events by dispatching an action, use a reducer to reduce the event
stream to a Store, or get the state of any of an event stream's stores.

Underneath the Dispatcher interface your event stream is represented by a ReactiveX
[*ReplaySubject*](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/replaysubject.md).

> **For Flux users:** It is crucial to understand, that with Fluorine the
> Dispatcher is the central hub of your app's state. Instead of stores there are
> reducers which describe how a store is 'manufactured' from the event stream.

> **For Redux users:** Fluorine uses a central Dispatcher, which is not present
> in Redux apps. Instead of manufacturing a root store, you create a Dispatcher.
> Stores are anonymous Observables (Think 'streams') which emit the store's
> state.

## Index

* [dispatch(action)](#dispatch)
* [getState(reducer)](#getState)
* [reduce(reducer, init)](#reduce)

--------------------------------------------------------------------------------

## <a id='dispatch'></a>[`dispatch(action)`](#dispatch)

This dispatches an action. An action is an event in the internal event stream.
(Behind the scenes this calls onNext on the internal ReplaySubject)

Dispatching an action will trigger each reducer with the current state and this
action.

### Arguments

1. `action`: An action should always be a plain object describing a change to
  your app's state, or a function generating actions. The action is later on
  passed into the reducers.

### Returns

A Promise containing the dispatched action.

### Notes

You can pass dispatch a plain object action. However, it is possible as well to
pass it a function. The function may produce actions in several ways. It may:

- Return a action
- Return a Promise that resolves to an action
- Use the callback to dispatch actions

Normally you won't call *dispatch* directly with actions, but use pure functions
which describe an action and will be injected using [*withStore*](withStore.md).

### Example

```js
import { Dispatcher } from './dispatcher'

function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

Dispatcher.dispatch(addTodo('Hello World'))

function getTodos(url) {
  return () => {
    return fetch(url)
  }
}

Dispatcher.dispatch(getTodos('http://example.com/my-todos'))

function generateTodos(array) {
  return dispatch => {
    array.forEach(obj => dispatch(obj))
  }
}

Dispatcher.dispatch(generateTodos([
  'A Todo',
  'Another Todo'
]))
```

--------------------------------------------------------------------------------

## <a id='reduce'></a>[`reduce(reducer, [init])`](#reduce)

Creates a Fluorine store. A store is just an observable which emits new states
of your store.

### Arguments

1. `reducer`: A reducing function that returns the next state. Its arguments are
  the past state and an action, that was injected into the Dispatcher.

1. `init`: The initial state of the store.

### Returns

The store. (An observable)

### Notes

Behind the scenes the store is represented by a ReactiveX
[BehaviorSubject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md).

### Example

```js
import dispatcher from './dispatcher'

function TodoStore(state = [], action) {
  switch (action.type) {
    type 'ADD_TODO':
      return state.concat([
        action.payload
      ])
    default:
      return state
  }
}

const store = dispatcher.reduce(TodoStore)
dispatcher.dispatch({
  type: 'ADD_TODO',
  payload: 'Hello World!'
})

store.subscribe(x => {
  console.log(x) // ['Hello World!']
})
```

--------------------------------------------------------------------------------

## <a id='getState'></a>[`getState(reducer)`](#getState)

Get the current state of a store that is generated using the passed in reducer.

### Arguments

1. `reducer`: See reduce method. This identifies the store, as it's generated
  by this very function.

### Returns

The current state of the store.

### Notes

This method should only be used for non-reactive parts of your application where
consecutive states don't matter. Otherwise you should always find a way to
integrate RxJS Observables into your app's logic.

### Example

```js
import dispatcher from './dispatcher'

function TodoStore(state = [], action) {
  switch (action.type) {
    type 'ADD_TODO':
      return state.concat([
        action.payload
      ])
    default:
      return state
  }
}

const store = dispatcher.reduce(TodoStore)
dispatcher.dispatch({
  type: 'ADD_TODO',
  payload: 'Hello World!'
})

store.getState() // ['Hello World!']
```
