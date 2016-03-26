# API Reference

Besides the obvious paradigms that come with RxJS and functional Flux,
Fluorine tries to be as unopinionated as possible. Its API is thus
not directed to a specific structure.

We encourage you to look at the other documentation and our examples
to decide for yourself how to use Fluorine.

> Note: All examples are written in ES6. You'll need to convert them
> to ES5 or lower, when you use them in your codebase.

## API

### [createDispatcher()](createDispatcher.md)

Returns a new [Dispatcher](dispatcher.md). A dispatcher is an applications
central event hub. It manages state and side effects. You can dispatch
new actions on it, and schedule agendas. Stores are derived from a
dispatcher by reducing its event stream.

### [wrapActions()](wrapActions.md)

Returns the action creators that were passed but wraps them to dispatch
their return values on an observer, typically a dispatcher.

### [withActions](withActions.md)

A decorator that wraps a React component. It takes a dispatcher and
passes action creators through to [wrapActions](wrapActions.md), whose
result is given to the React component as a prop.

### [withStore](withStore.md)

A decorator that wraps a React component. It takes an observable,
typically a store and subscribes to it. The changing value that is
emitted is given to the React component as a prop.

### [Provider](provider.md)

A React component that makes a dispatcher and an observable available
to lower components in the context.

### [connectStore](connectStore.md)

A decorator that wraps a React component. It receives an observer and an
observable from a Provider above, and gives the React component
the changing value from the observable (like withStore) and the
observer.

