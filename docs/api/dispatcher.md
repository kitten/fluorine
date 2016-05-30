# Dispatcher

A Dispatcher is the central hub for your actions and agendas.

It is usable like a normal subject, meaning it is an observable that emits agendas, and an
observer that dispatches agendas, promises, thunks and actions on the dispatcher.

Take a look at [createDispatcher](createDispatcher.md) to learn how to create new dispatchers.

[Learn more about the concept of a dispatcher in the Concepts documentation.](../concepts/fully-reactive-dispatchers-and-stores.md)

## Methods

* [reduce](#reduce)
* [next](#next)
* [wrapActions(actions)](#wrapActions)

--------------------------------------------------------------------------------

## reduce()

A store is just an observable which emits new states of your store.
Reduces the dispatcher to a store, which uses a reducer function to reduce all agendas
on the dispatcher stream to consecutive values, describing the store's state.

### Arguments

- `reducer`: A reducer function that takes the current store state and an action and
  returns the next state. The signature is `(state, action) => nextState`.

- [`init`]: An initial value that is passed to the reducer. By default this is `undefined`.

### Returns

An observable, which emits values, describing the store's state.

### Discussion

A store's state is only reduced from the agendas that were emitted after reduce
was called. This is so that memory can be released after agendas complete.

The initial value is useful to restore a store's state.

### Example

This is an example demonstrating what `reduce` does, not how you should use it in your app.
Take a look at [withStore](withStore.md) to see an examples on how to inject a store's
state into a component.

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
dispatcher.next({
  type: 'ADD_TODO',
  payload: 'Hello World!'
})

store.subscribe(x => {
  console.log(x) // ['Hello World!']
})
```

--------------------------------------------------------------------------------

## next()

Dispatches agendas, thunks, promises and actions on the dispatcher stream.
This is the method with which you want to modify your stores' states.

This is part of the Dispatcher's observer, since it can be used like a normal
observer.

### Arguments

- `input`: Either an agenda, a thunk, a promise, or an action.

### Returns

*Nothing.* :flags:

### Resulting Agenda

Depending on what you pass to next, an agenda is scheduled on the dispatcher's
event stream. Internally the dispatcher doesn't work with actions anymore, but
exclusively with agendas.

[Read more about the agendas in the Concepts documentation](../concepts/abstracting-side-effects-as-agendas.md)

#### Agenda

In case you've passed an agenda (Observable) it is directly dispatched on the
dispatcher's event stream.

#### Promise

In case you've passed a promise, the promise is converted into an observable. This
observable is dispatched on the dispatcher's event stream. It is converted using the
following RxJS method.

```js
Observable.fromPromise(input)
```

It basically just creates an observable that emits the promise's result and
completes.

#### Thunk

A thunk is just a function. In case you pass a function to next, then it's automatically
treated as a thunk. The function will receive two arguments:

- `next`: A function that calls the dispatcher's `next` method using the first
  argument.

- `reduce`: The dispatcher's reduce method, to derive agendas from a store's state.

These thunks are different from those that you're passing to dispatch (*deprecated*).

Not only can they be used to dispatch other thunks, agendas and promises, additionally
to actions on the dispatcher's event stream, but they can be used to derive an agenda
from the dispatcher without using the dispatcher as a singleton.

An example will follow below.

#### Action

If the next method can't match something else, it assumes that the argument is a pure action,
and wraps it in an observable.

```js
Observable.of(input)
```

This emits the action and immediately completes.

### Discussion

This dispatches agendas on the dispatcher's event stream. This agenda is transformed a little,
and then shared between all stores. The stores subscribe to the agenda, using a shared
subscription, and use the emitted actions to generate their consecutive state.

For the case an agenda fails, each store keeps a linked list of its state. When a store
subscribes to an agenda it saves an the current state in a variable as an 'anchor'.

If an agenda fails, from this anchor on the linked list of states is traversed and the state
is regenerated, skipping actions that the failed agenda emitted. This effectively reverses
all changes that an agenda made.

Due to the fact that only a reference to the most current state and an anchor for each
running agenda is kept, old state is garbage collected.

### Example

From taking a look at the [Counter example](https://github.com/philpl/fluorine/blob/master/examples/counter/src/actions/counter.js),
you can find most of the different things that can be passed to next.

----------------------------------------------------------------------------------------

## wrapActions()

Returns the action creators that were passed but wraps them to dispatch
their return values.

This uses the [wrapActions](wrapActions.md) function underneath. Go there to
read all about it.

### Arguments

- `actions`: Either an action creator; or an array, or object containing
  action creators.

