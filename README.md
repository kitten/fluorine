# Fluorine

[![Join the chat at https://gitter.im/philplckthun/fluorine](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/philplckthun/fluorine?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Fluorine provides you with the tools to accumulate your state from a stream of
actions.

It is building on Redux's ideologies by eliminating the state container and
replacing it with just the Dispatcher. Using RxJS it generates dynamic and
anonymous observables containing your state.

Use all advantages of Redux and RxJS for your next React project.

[![build status](https://img.shields.io/travis/philplckthun/fluorine/master.svg)](https://travis-ci.org/philplckthun/fluorine)
[![npm version](https://img.shields.io/npm/v/fluorine-lib.svg)](https://www.npmjs.com/package/fluorine-lib)

## Installation

To install the latest version:

```
npm install --save fluorine-lib
```

## Influences

Fluorine is heavily inspired and based on the ideas of Redux.

## Documentation and Example

TBD

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
