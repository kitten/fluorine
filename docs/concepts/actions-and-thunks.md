# Actions and Thunks

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

## Actions and Action Creators

For each action you will be writing an **action creator**.

> "The dispatcher exposes a method that allows us to trigger a
> dispatch to the stores, and to include a payload of data,
> which we call an action. The action's creation may be wrapped
> into a semantic helper method which sends the action to the
> dispatcher." - Flux Documentation

As described in the section before, action creators are pure functions that
return a new action object. Here's the matching action creator for the action
above.

```js
function updateTodo(id, text) {
  return {
    type: TODO_UPDATE_TEXT,
    id,
    text
  }
}
```

Pairing the action creator with the dispatcher's `next` method now dispatches
the actual action.

```js
dispatcher.next(updateTodo(0, 'Hello World!'))
```

Feel free to read more about
[`Dispatcher.next` in the API documentation](../api/dispatcher.md#next)

In your actual app, this can be easily abstracted away
by wrapping the action creator in a function dispatching
the action for you instead. This has the advantage that
it's a function that you can easily pass around, without
passing on any knowledge about the dispatcher.

```js
const _updateTodo = dispatcher.wrapActions(updateTodo)
_updateTodo(0, 'Hello World!')
```

- More about that in the API docs under [Dispatcher.wrapActions](../api/dispatcher.md#wrapActions)
- An alternative for using this easily with React components: [withActions](../api/withActions.md)
- Look here to see wrapActions in action: [Todo MVC Example MainSection](https://github.com/philpl/fluorine/blob/master/examples/todo/src/components/MainSection.jsx)

## Side effect management

Your application will certainly have **side effects**. State from the outside,
`POST`ing to update a database, communicating over websockets, and other
useful bits that make the web fun.

### Promises

If you're already using promises for your requests, it's tempting to start with
simply dispatching after a promise resolves

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

The primary problems with the above code is that it's coupled to the dispatcher
and doesn't allow the dispatcher to reason about any rejections in promises.
Instead, write a function that returns a promise for an action creator:

```js
function fetchTodos() {
  return fetch('/todo-list')
    .then(res => res.json())
    .then(todos => addTodos(todos))
}
```

Fluorine will accept this promise directly via the next method
to allow a side effect with a single action:

```js
dispatcher.next(fetchTodos())
```

### Thunks

Thunks are a function that wraps some behavior for later execution (functions
returning functions!).

For Fluorine, these are functions you return in your action creators:

A thunk is a function that you return in your action
creators and are fully supported by Fluorine. An action
creator using a thunk for the example above may look
like this:

```js

function fetchTodos() {
  return fetch('/todo-list')
    .then(res => res.json())
    .then(todos => addTodos(todos))
}

function thunkedTodos() {
  return dispatch => {
    dispatch(fetchTodos)
  }
}
```

They allow a wide variety of iterative logic to execute side effects and
dispatch multiple actions unlike promises.

The [`dispatcher.next`](../api/dispatcher.md#next)
method will inject a dispatch method into a thunk's first
argument automatically:

```js
dispatcher.next(thunkedTodos())
```

The usage hasn't changed compared to promises.

Another nice detail is, that the dispatch method always tries to
return a promise resolving to the dispatched action.

In the case of thunks the dispatch method returns a promise
resolving to what the thunk returned. This can be very
convenient to quickly react to the action completion on
your UI.

### The Problem

The problem with these two primitive forms of side
effects management is, that they're not versatile
enough. They don't allow complex, concurrent ways to
manage side effects and are really a pain to use.

In highly complex apps action creators can stay relatively
small as they just transform their input to better suit
the store. **Side effects** in more complex actions
can get very confusing and long. This is a nightmare for projects
that will grow very large over time.

To solve these problems Fluorine introduces **Agendas**.

