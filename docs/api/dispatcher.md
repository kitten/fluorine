# Dispatcher

A Dispatcher is the central hub for your actions and agendas.

It is usable like a normal subject. You can call next to schedule new agendas,
or dispatch actions. You can also directly subscribe to it to get the raw
stream of agendas.

## Methods

* [reduce(reducer, init)](#reduce)
* [next(agenda)](#dispatch)
* [wrapActions(actions)](#wrapActions)
* [schedule(agenda) *deprecated*](#schedule)
* [dispatch(agenda) *deprecated*](#dispatch)

--------------------------------------------------------------------------------

## <a id='reduce'></a>[`reduce(reducer, [init])`](#reduce)

Takes a reducer and returns a Fluorine store.

A store is just an observable which emits new states of your store.

### Arguments

1. `reducer`: A reducing function that returns the next state. The reducer's
  signature is `function (state, action)`, where state is the previous state
  of your store.

1. `init`: The initial value of the store. This is useful if you've cached
  a previous state somewhere and want to restore it. By default the initial
  state is `undefined`.

### Returns

A [BehaviorSubject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md)
emitting your store's state.

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

## <a id='wrapActions'></a>[`wrapActions(actions)`](#wrapActions)

Takes actions and "binds" them to the dispatcher. It wraps
the action creators in functions that dispatch the return values.

### Arguments

1. `actions`: This can be:
  - a single action creator
  - an object containing only action creators
  - an array containing action creators

### Returns

Depending on what you passed as `actions` it will return the same type, but
with the action creators wrapped in a function that passes the result into
the dispatch method.

The wrapper function is: `(...args) => dispatch(action(...args))`

### Example

```js
import dispatcher from './dispatcher'

function addTodo(str) {
  return {
    type: 'ADD_TODO',
    payload: str
  }
}

const boundAddTodo = dispatcher.wrapActions(addTodo)

const obj = dispatcher.wrapActions({ addTodo })
obj.boundAddTodo

const arr = dispatcher.wrapActions([ addTodo ])
arr[0]
```

--------------------------------------------------------------------------------

## <a id='dispatch'></a>[`dispatch(action)`](#dispatch)

**Deprecated**

Takes a thunk, a promise, or a plain action; converts it into an agenda and
schedules it.

### Arguments

1. `action`: This can either be:
  - a plain *action* object
  - a promise resolving to an *action*
  - or a thunk (function)

The *thunk* has the signature: `function (dispatch)`, where dispatch is
a method taking a plain action object.

### Returns

A Promise resolving to the dispatched action.

In the case of a *thunk* it returns a promise wrapping the value
that the *thunk* has returned.

### Notes

Instead of using this directly you'd probably use the [`wrapActions`](#wrapActions)
method or the [`withActions`](withActions.md) decorator.

--------------------------------------------------------------------------------

## <a id='schedule'></a>[`schedule(agenda)`](#schedule)

**Deprecated**

Schedule a new Agenda. This is an alternative to [`.dispatch()`](#dispatch) that
takes observables instead of actions or action creators. Instead this observable
then emits actions.

This has two big advantages:

* It is easy to represent an asynchronous task with an
observable, instead of repeatedly calling the `dispatch` callback in a thunk.

* If the agenda (observable) fails all its action will be rolled backed. It will
be like you never scheduled the task.

### Arguments

1. `agenda`: An observable emitting actions

Optionally you can pass multiple agendas and they will be concatenated using
`Observable.concat([])`.

### Returns

**Nothing**

### Notes

Unlike `.dispatch()` this method doesn't return a promise. You should rely on
RxJS's side effects to react to completion or a certain state. Check out the
[`do` operator](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/do.md).

When using this to send requests to an API, you can reverse the standard order
of doing things. If you would normally `POST` a new resource and dispatch the
create action if that succeeds, try dispatching first. If the `POST` request
fails, you can let Fluorine revert the action automatically. In calls that will
likely succeed, this is a big win for UI smoothness.

### Example

This is a rough example of the note above.

```js
import dispatcher from './dispatcher'

dispatcher.schedule(Observable
  .of({
    type: 'ADD_USER',
    payload: {
      name: 'Leonardo'
    }
  })
  .concat(Observable
    .of('/user')
    .flatMap(path => Observable
      .fromPromise(fetch(path, {
        method: 'POST'
      }))
    )
  )
```

