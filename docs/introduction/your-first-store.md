# Your First Store

Now that you've got your project structure set up, let's write
a simple store. For this example we will code a simple Counter
store that supports adding and subtracting.

We will have to write:

* Actions and Action creators
* Action types (constants)
* a Reducer

## The Reducer

The *Reducer* is a function that is applied to each action on the
dispatcher stream with the preceding state and returns the next
state. Consult the "Concepts" part of the documentation for an
extensive description of reducers and the dispatcher.

Core to understanding how to write a reducer is that you're
describing how the state of your store will change if a certain
action is dispatched.

As in all Flux implementations, actions should always be regular JS
objects. They are easy to create, read and debug. You could use
something else, but all - Redux, Flux and Fluorine - heavily
recommend to just use objects. Consult the "Concepts" part of the
documentation for more on actions.

The signature of a reducer is: `(previousState, action) => state`

Advantageous for this are switch-statements, but you can replace
them with anything else if you want. For the sake of this example
though, we will only use switch statements, as they are commonly
understood.

So for our Counter store we would code something like this:

```
import {
  COUNTER_ADD,
  COUNTER_SUBTRACT
} from '../constants/CounterTypes'

function Counter(state = 0, action) {
  switch (action.type) {
    type COUNTER_ADD: {
      return state + 1
      break
    }

    type COUNTER_SUBTRACT: {
      return state - 1
      break
    }

    default: return state
  }
}
```

So this reducer describes the mutations of our store neatly.

Note how any unrelated action would make the reducer return an
unchanged state.

Also a reducer shouldn't modify the previous state in any way. Stores
depend on their state over time being immutable. This is especially
in Fluorine.

Your stores are represented by Observables, which in terms abstract
events over time. So if your store's state is changing over time,
but the state's reference stays the same, you're going to end up
being unable to access older events on your store as they've been
overwritten.

So always return new instances as state. You can check out
[Immutable.js](https://facebook.github.io/immutable-js) to make this
as easy as possible. It provides you with immutable data structure,
which go great with reducers.

## The Actions

