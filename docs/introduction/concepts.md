# Concepts

This document describes every major part of Fluorine's structure, ideas, and
concepts while providing examples for each pattern so you can apply them yourself.

As much as possible, Fluorine tries to be lightweight and encourage good
patterns. If it gets in your way, post an issue!

## Index

* [Flux and Unidirectional Dataflow](#flux-and-unidirectional-dataflow)
* [Functional Additions to Flux](#functional-additions-to-flux)
* [Actions and Thunks](#actions-and-thunks)
* [Abstracting Side effects as Agendas](#abstracting-side-effects-as-agendas)
* [Fully Reactive Dispatchers and Stores](#fully-reactive-dispatchers-and-stores)

------------------------------------------------------------------------------

## <a id='flux-and-unidirectional-dataflow'></a>[Flux and Unidirectional Dataflow](#flux-and-unidirectional-dataflow)

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

More on the dispatcher and the stores will follow in
[Fully Reactive Dispatchers and Stores](#fully-reactive-dispatchers-and-stores)

[flux-simple-diagram]: ../img/flux-simple-diagram.jpg
[flux-dispatch-diagram]: ../img/flux-dispatch-diagram.jpg


## <a id='functional-additions-to-flux'></a>[Functional Additions to Flux](#functional-additions-to-flux)

Two functional additions to Flux, that came by way of Redux are stores and action creators.

### Stores

Stores are computed using **reducers**. They must be pure functions,
without side effects. They have the function
signature:

```js
(lastState, action) => nextState
```

- `lastState` is the last state, that was emitted by your store.
- `action` describes the mutation that should be made to your state.

This reducer returns the next state of your store based on the prior state. It's
up to the dispatcher to compute the consecutive states with each reduction.

```js
actions = [action1, action2, action3]
newState = actions.reduce(reducer, originalState)
```

This is very similar to RxJS's `scan` method.
[More info](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/scan.md)

More on the dispatcher and the stores will follow in
[Fully Reactive Dispatchers and Stores](#fully-reactive-dispatchers-and-stores)

Check out the [reducer in our Todo MVC Example](https://github.com/philpl/fluorine/blob/master/examples/todo/src/reducers/todo.js)
 to see a store in action.

### Action Creators

Actions are created by pure functions with the signature:

```js
(...args) => action
```

This is then called an action creator. This is a simplified design pattern
to keep your actions consistent and well-tested.

**Example**: Check out the [actions in the Todo MVC Example](https://github.com/philpl/fluorine/blob/master/examples/todo/src/actions/todo.js).

## <a id='actions-and-thunks'></a>[Actions and Thunks](#actions-and-thunks)

As you've just read, actions abstract mutations to our data. They are plain
objects that describe our intent to mutate data.

Traditionally they carry a *key* that allows reducers to identify the action
that should be carried out.

An action might look something like this:

```js
{
  type: TODO_UPDATE_TEXT,
  id: todoId,
  text: newText
}
```

The type is typically a constant / variable that's imported from
a constants module related to the specific store. It is supposed
to be a string or symbol, so that it's both human readable and
debuggable.

### Actions and Action Creators

For each action you will be writing an **action creator**.

> "The dispatcher exposes a method that allows us to trigger a
> dispatch to the stores, and to include a payload of data,
> which we call an action. The action's creation may be wrapped
> into a semantic helper method which sends the action to the
> dispatcher." - Flux Documentation

As described in the section before, action creators are just
pure functions returning a new action object.
For the action above it thus might look like this:

```js
function updateTodo(id, text) {
  return {
    type: TODO_UPDATE_TEXT,
    id,
    text
  }
}
```

This action creator can then be used together with the
dispatcher's `dispatch` method:

```js
dispatcher.dispatch(updateTodo(0, 'Hello World!'))
```

More about the dispatcher method in the API docs:
[Dispatcher.dispatch](../api/dispatcher.md#dispatch)

In your actual app, this can be easily abstracted away
by wrapping the action creator in a function calling
this method for you instead. More about that in the
API docs:
[Dispatcher.wrapActions](../api/dispatcher.md#wrapActions)
[withActions](../api/withActions.md)

See the `wrapActions` method in use in our Todo MVC
Example app:
[Todo MVC Example MainSection](https://github.com/philpl/fluorine/blob/master/examples/todo/src/components/MainSection.jsx)

### Side effect management

Now in your application you will certainly have **side effects**.
The most common of them will probably be *RESTful requests*.

#### Promises

If you're already using promises for your requests, it's easy
to use them.

```js
function addTodos(todos) {
  return {
    type: TODO_ADD_TODOS,
    payload: todos
  }
}

function fetchTodos() {
  return fetch('/todo-list')
    .then(res => res.json())
    .then(todos => {
      dispatcher.dispatch(addTodos(todos))
    })
}
```

Now, this is of course doesn't abstract the side effect
cleanly. But still you'd be pulling your requests directly
in and dispatching an action as a result.

To use a promise as a side effect do this instead:

```js
function fetchTodos() {
  return fetch('/todo-list')
    .then(res => res.json())
    .then(todos => addTodos(todos))
}
```

Fluorine allows you to use promises directly in the
dispatch method to allow a side effect with a single
action:

```js
dispatcher.dispatch(fetchTodos())
```

#### Thunks

Redux introduced **thunks** to handle side effects.
They're by far the most common side effect abstraction
at the moment.

A thunk is a function that you return in your action
creators and are fully supported by Fluorine. An action
creator using a thunk for the example above may look
like this:

```js
function fetchTodos() {
  return dispatch => {
    return fetch('/todo-list')
      .then(res => res.json())
      .then(todos => {
        dispatch(addTodos(todos))
        return todos
      })
  }
}
```

They of course easily allow a wide variety of iterative
logic to execute side effects and dispatch multiple
actions unlike promises.

The [`dispatcher.dispatch`](../api/dispatcher.md#dispatch)
method will inject a dispatch method into a thunk's first
argument automatically:

```js
dispatcher.dispatch(fetchTodos())
```

The usage thus hasn't changed compared to promises.

Another nice detail is, that the dispatch method always tries to
return a promise resolving to the dispatched action.

In the case of thunks the dispatch method returns a promise
resolving to what the thunk returned. This can be very
convenient to quickly react to the action completion on
your UI.

#### The Problem

The problem with these two primitive forms of side
effects management is, that they're not versatile
enough. They don't allow complex, concurrent ways to
manage side effects and are really a pain to use.

In highly complex apps action creators can stay relatively
small as they just transform their input to better suit
the store. **But** side effects in more complex actions
can get very confusing and long. A nightmare for projects
that will grow very large over time.

To solve this problems Fluorine introduces **Agendas**.
More about them in the next section: [Abstracting side effects as Agendas](#abstracting-side-effects-as-agendas)


## <a id='abstracting-side-effects-as-agendas'></a>[Abstracting Side effects as Agendas](#abstracting-side-effects-as-agendas)

Agendas are a new way to manage your side effects and internally
abstract every single action already.
Think about agendas as descriptions of tasks. They are
scheduled on the dispatcher and describe a stream of
actions.

What that means is, that Agendas are **Observables** emitting
actions.

Instead of being dispatched they are scheduled on the dispatcher:

```js
dispatcher.schedule(agenda)
dispatcher.schedule(agendaCreator())
```

**So now you're thinking: Why is this easier than thunks?**

The properties of Observable perfectly fit our problem. We need
to represent a stream of actions with a set of side effects.
Side effects might influence actions, but sometimes they
don't.

Let's list all tricks and features that are possible with Agendas:

### Composing actions

This is simple, but let's say you've got two agendas, representing
two tasks:

```js
const clearTodos = Observable.of({ type: TODO_CLEAR_TODOS })
const makeCookies = Observable.of({ type: COOKIE_MAKE_COOKIES })
```

And now you want to execute both tasks as a single task?
Just concat the observables!

```js
const fusion = clearTodos.concat(makeCookies)
dispatcher.schedule(fusion)
```

Concatenating agendas is very common and that's why the
concatenation is baked into the schedule method. Just
pass multiple agendas as arguments and they will be
concatenated:

```js
dispatcher.schedule(clearTodos, makeCookies)
```

### Writing action-less Side effects

How do you represent side effects you ask? Side effects are
represented by observables that **don't** emit any actions.

Let's say you're adding a todo to your server:

```
function addTodo(id, text) {
  return Observable
    .fromPromise(fetch('/add-todo', { method: 'POST' }))
    .map(() => null)
}
```

In this example we don't care about the actual result of
the request, as long as it succeeds. So we can replace
every emitted event with `null`.

*Note:* The RxJS `ignoreElements` method might be suitable as
well in some cases, but will fail when the resulting
Observable doesn't emit any items.

This is a clean side effect, that doesn't emit any actions
on its own.

### Writing Side effects that create actions

What if we care about the result of our requests and want
to emit actions depending on their outcome?

Easy. We map their results to our actions!

```js
function _addTodos(todos) {
  return {
    type: TODO_ADD_TODOS,
    payload: todos
  }
}

const fetchTodos = Observable
  .fromPromise(fetch('/list-todo'))
  .map(todos => _addTodos(todos))
```

### Composing actions with action-less side effects

Now let's say your user is adding a todo and you want to
send a request to your server with the example before to
save it.

To make the UI seem very smooth we want to emit the action
that creates the todo right away. Afterall we know the
todo's contents anyway, regardless of the request.

So this adds the request as a side effect that doesn't
emit an action:

```js
function _addTodo(id, text) {
  return {
    type: TODO_ADD_TODO,
    id,
    text
  }
}

export function addTodo(id, text) {
  return Observable
    .of(_addTodo(id, text))
    .concat(Observable
      .fromPromise(fetch('/add-todo'))
      .map(() => null)
    )
}
```

So now we emit the action, that adds a todo, and make the
request afterwards.

### Automatic Rollback on Errors

In the example before we add the todo first, and then
contact the server afterwards. But what if something
goes wrong? We've already emitted the action, that
adds the todo to the store, how do we revert that?

**In Fluorine the dispatcher automatically reverts an
agenda if it fails!**

Each store non-destructively recomputes it state, filtering
the actions that your agenda emitted.

So your agenda is cleanly rolled back, while all other
agendas are unaffected!

This allows you to handle errors smartly and make the
UI buttery smooth.

### Shared / Duplicate Tasks

Say you're fetching your todos in two different parts
of the UI and those are opened at the same time?

This means for thunks that they're dispatched twice.

Instead of doing complex hacking, you can use RxJS's
`share` operator, right inside your actions module:

```
const fetchTodos = Observable
  .fromPromise(fetch('/list-todo'))
  .map(todos => _addTodos(todos))
  .share()
```

Now both scheduled agendas share the same subscription
to `fetchTodos` underneath and thus the agenda is only
executed once.

### Agendas FTW

Now that you know how awesome agendas are try them out
yourself!

[See them in action in the counter example.](https://github.com/philpl/fluorine/tree/master/examples/counter)


## <a id='fully-reactive-dispatchers-and-stores'></a>[Fully Reactive Dispatchers and Stores](#fully-reactive-dispatchers-and-stores)

The Dispatcher is your application's event hub. It manages your ongoing
scheduled *agendas* and dispatched actions.

It is typically kept as a singleton in a file in your source code's root.
But this is free to you. In React you could also write a `Container`
component, that distributes a dispatcher to underlying components through
the context.

### Actions on the Dispatcher

To understand the inner workings of the dispatcher, you should see it
as an event hub, that takes agendas as input.

As Agendas are just observables emitting actions, a dispatcher subscribes
to it and reduces these actions to a store.

### Stores from the Dispatcher

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

## Afterword

I hope this introduction wasn't too long. Thanks for reading it. Have a cookie! :cookie:

Don't forget that Fluorine is dynamic and just a set of tools! Use it however
you wish and with whatever UI library you prefer.

## Continue to read

The next part in the introduction is on how to write your first Fluorine store:
[Your First Store](your-first-store.md)
