# Fluorine

**Use RxJS plus easy state and side effect management for your next React project.**

Fluorine provides you with easy and reactive state and side effect management,
using a single stream of actions. It builds on the ideas of Redux, while preserving
a Flux-like Dispatcher as the single source of truth.

- Your stores are directly reduced from the dispatcher and actions are dispatched on it
- Manage your side effect as Observables with automatic rollbacks if something went wrong
- Unopinionated and simple API

[**You can find a raison d'être and a short comparison to Redux on Medium**](https://medium.com/@PhilPlckthun/fluorine-flux-beyond-redux-with-rxjs-79c80c7663b4)

[![build status](https://travis-ci.org/philpl/fluorine.svg)](https://travis-ci.org/philpl/fluorine)

## Installation

To install the latest stable version:

```sh
npm install --save fluorine-lib
```

It will install the `babel-runtime` and `@reactivex/rxjs` as dependencies.

It furthermore needs React as a peer dependency to work:

```sh
npm install --save react
```

If you wish to use the dispatcher without the decorators for a *non-React* project
then just import the `createDispatcher` method, without anything else:

```
import createDispatcher from 'fluorine-lib/lib/createDispatcher'
```

## A Short Demo

This is just a short example that quickly presents all features of the Dispatcher.
It is of course not representetive for how to use it in real React projects.

```js
import { createDispatcher } from 'fluorine-lib'

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your project.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

// Create a dispatcher which is our event stream
const dispatcher = createDispatcher()

// This reduces the dispatcher event stream to a store. This is essentially an
// RxJS Observable that emits the state of the store over time
const store = dispatcher.reduce(counter)

store.subscribe(x => {
  console.log(x) // Your store's state
})

// Dispatch an action, a thunk, or a promise

dispatcher.dispatch({ type: 'INCREMENT' })

dispatcher.dispatch(dispatch => {
  dispatch({ type: 'DECREMENT' })
})

dispatcher.dispatch(new Promise((resolve, reject) => {
  resolve({ type: 'INCREMENT' })
}))

// Agendas: Schedule a task, represented by an observable that emits actions
// If the observable fails, then all its changes are reverted

const addIfFetchSucceeds = Observable
  .of({ type: 'ADD' })
  .concat(Observable
    .of('/ping')
    .flatMap(path => Observable.fromPromise(fetch(path)))
  )

dispatcher.schedule(addIfFetchSucceeds)
```

Just as in Flux we've got stores, actions and a dispatcher. The seperation of
concern is intact, while the dispatcher exclusively is the single source of truth.

Compared to Redux we've got fully functional actions and stores as well, but the
state is handled fully reactively using RxJS. We can even use all of RxJS's
operators.

On top of that we've got a new way of handling side effects: Agendas. This enables
you to schedule observables as streams of actions, which roll back all their changes
if they fail. This makes it easy to design exceedingly complex side effects.

## Documentation

* [API Reference](docs/api/README.md)

To be done:

* Basics
* Glossary

## Frequently Asked Questions

### Why write another Flux library?

The goal of this project is to create a efficient but minimal library on top
of RxJS that can preserve your previous (pure reducer) stores and actions, which
you would write for a Redux project as well, but give you even more power over
them.

Redux is building on top of the known strengths of Flux by mixing it with more
functional ideas, but without a tool like RxJS it fails to combine the
dispatcher and stores. Fluorine doesn't need containers for stores as
every store can be reduced from the actions on the Dispatcher reactively.

On top of that Fluorine provides a new way to manage side effects, which is much
more powerful than plain thunks.

### Why the name?

Fluorine is (chemically-speaking) the most *reactive* non-metal. As Fluorine
embraces RxJS to bring even more advantages of reactive programming to React, it
is a fitting name.

Furthermore the latin verb *fluo* means "flow", which reminded me about Flux and
its unidirectional data-flow.

## Thanks to

* The ReactiveX, all the RxJS developers and the ReactiveX community
* Dan Abramov for Redux that is a big influence to Fluorine
* The React team

## License

MIT
