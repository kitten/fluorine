# Fluorine

Fluorine provides you with the tools to accumulate your state from a stream of
actions.

It is building on Redux's ideologies by eliminating the state container and
replacing it with just the Dispatcher. Using RxJS it generates dynamic and
anonymous observables containing your state.

Use all advantages of Redux and RxJS for your next React project.

[**You can find a raison d'être and a short comparison to Redux on Medium**](https://medium.com/@PhilPlckthun/fluorine-flux-beyond-redux-with-rxjs-79c80c7663b4)

[![build status](https://img.shields.io/travis/philplckthun/fluorine/master.svg)](https://travis-ci.org/philplckthun/fluorine)
[![npm version](https://img.shields.io/npm/v/fluorine-lib.svg)](https://www.npmjs.com/package/fluorine-lib)
[![gitter channel](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/philplckthun/fluorine?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

To install the latest version:

```
npm install --save fluorine-lib
```

## Shortest Demo Possible

This is an identical demo to the one on the Redux repo for comparison.

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
// We can now use its methods: dispatch, getState and reduce
const dispatcher = createDispatcher()

// This reduces the dispatcher event stream to a store. This is essentially an
// RxJS Observable that emits the state of the store over time
const store = dispatcher.reduce(counter)

store.subscribe(x => {
  console.log(x)
})

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

Compared to Flux we've got a much better separation of concerns. The store is
just a pure function that describes the changing of the store's state with each
action that is received.

Compared to Redux we've got our single source of truth inside the Dispatcher as
a stream of events / actions. We can even use the RxJS methods to operate on a
store's state or even on all actions by calling methods on the Dispatcher itself.

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
dispatcher and stores. We don't need to provide containers for our stores as
every store is just an instruction on how to generate state from the
Dispatcher. So Fluorine generates an observable that reduces your Dispatcher
to an anonymous stream of state and provides tools to inject this state into
your React application.

### Why the name?

Fluorine is (chemically-speaking) the most *reactive* non-metal. As Fluorine
embraces RxJS to bring even more advantages of reactive programming to React, it
is a fitting name.

Furthermore the latin verb *fluo* means "flow", which reminded me about Flux and
its unidirectional data-flow.

## Thanks to

* Dan Abramov for Redux that is a big influence to Fluorine
* The rackt team
* The React team
* The ReactiveX and RxJS developers and the ReactiveX community

## License

MIT
