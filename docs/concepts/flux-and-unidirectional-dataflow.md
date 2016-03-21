# Flux and Unidirectional Dataflow

Fluorine stands in the "tradition" of a lot of other Flux frameworks. In particular,
we're referring to the unidirectional data flow, and some other properties of Flux.

If you haven't worked with other Flux frameworks before, **fear not!** This
guide is here to help you and others along in your journey to building maintainable
asynchronous data flows as well as pleasing users and yourself.

The basic **state manager** uses:

- actions
- a dispatcher
- and stores

![The basic Flux data flow][flux-simple-diagram]

The "view" is what a user sees. With React and other virtual DOM libraries, this
is the manifestation of what ends up on the real Document Object Model (DOM).

When a user interacts with that view, those interactions need to mutate the
managed state. Those interactions need to trigger changes to the state by
dispatching actions.

![Dispatching new actions][flux-dispatch-diagram]

In other words, actions describe mutations to our data, while the data itself
is stored in the stores.

As you can see on the two diagrams, all actions are dispatched
on the `Dispatcher`. Think about it as your app's central event stream, scheduling
tasks for you.

*The manager of your state and side effects is your Dispatcher.*

The Dispatcher is the **single source of truth**. All stores are directly
derived from it and react to its actions.

[flux-simple-diagram]: ../img/flux-simple-diagram.jpg
[flux-dispatch-diagram]: ../img/flux-dispatch-diagram.jpg

