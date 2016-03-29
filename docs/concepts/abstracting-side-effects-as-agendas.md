## Abstracting Side effects as Agendas

Agendas are a new way to manage your side effects and internally
abstract every single action. Think about agendas as descriptions of tasks.
They are scheduled on the dispatcher and describe a stream of actions.

If you came here as a happy RxJS user, Agendas are **Observables** emitting
actions.

The usage is the same as using actions, thunks, or promises:

```js
dispatcher.next(agenda)
dispatcher.next(agendaCreator())
```

<!-- TODO: Define Observable -->

**What makes this easier than thunks?**

The properties of Observable perfectly fit our problem. We need
to represent a stream of actions with a set of side effects.
Side effects might influence actions, but sometimes they
don't.

Let's list all tricks and features that are possible with Agendas.

## Composing actions

Let's say you have two agendas, representing two tasks:

```js
const clearTodos = Observable.of({ type: TODO_CLEAR_TODOS })
const makeCookies = Observable.of({ type: COOKIE_MAKE_COOKIES })
```

And now you want to execute both tasks as a single task?
Just concat the observables!

```js
const fusion = clearTodos.concat(makeCookies)
dispatcher.next(fusion)
```

Concatenating agendas is very common and that's why the
concatenation is baked into the schedule method. Pass multiple agendas as
arguments and they will be concatenated:

```js
dispatcher.next(clearTodos, makeCookies)
```

## Writing action-less Side effects

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

## Writing Side effects that create actions

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

## Composing actions with action-less side effects

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

## Automatic Rollback on Errors

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

## Agendas depending on a store's state

If you need to access a store's state for creating an agenda, then
you can use thunks for that as well.

The second argument of a thunk will be the dispatcher's reduce
method.

```
const agenda = (next, reduce) => reduce(TodoStore)
  .map(x => x.size % 2 === 0 ? clearAllTodos() : null)
```

[Read more about the next method's capabilities in the API docs.](../api/dispatcher.md#next)

## Shared / Duplicate Tasks

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

## Agendas FTW

Now that you know how awesome agendas are try them out
yourself!

[See them in action in the counter example.](https://github.com/philpl/fluorine/tree/master/examples/counter)


