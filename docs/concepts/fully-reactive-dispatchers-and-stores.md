# Fully Reactive Dispatchers and Stores

The Dispatcher is your application's event hub. It manages your ongoing
scheduled *agendas* and dispatched actions.

It is typically kept as a singleton in a file in your source code's root.
But this is free to you. In React you could also write a `Container`
component, that distributes a dispatcher to underlying components through
the context.

## Actions on the Dispatcher

To understand the inner workings of the dispatcher, you should see it
as an event hub, that takes agendas as input.

As Agendas are just observables emitting actions, a dispatcher subscribes
to it and reduces these actions to a store.

## Stores from the Dispatcher

As the state of your stores are derived from the stream of agendas and their
actions, the dispatcher is the single source of truth.

The store's states are computed using the actions and are thus derived
consecutively. You need the last state of the store to generate the next.
That's what makes actions the description of mutations.

Now a store is nothing else than an observable as well. A store is an observable
emitting state over time.

The data flow describing the dispatcher is:

```js
Agendas -> Actions -> Reducers -> Stores
```

A small implementation detail is, that when reducing the dispatcher subscribes to a
[Subject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md),
and then nestedly subscribes to the agendas inside.

The states of your stores are then computed and stored using a special linked list,
with roll back support and emitted on a
[BehaviorSubject](ihttps://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md)
which represents your store.

