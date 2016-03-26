# [withStore](withStore.md)

A decorator that wraps a React component. It takes an observable,
typically a store and subscribes to it. The changing value that is
emitted is given to the React component as a prop.

Internally it uses [connectStore](connectStore.md).

## Arguments

1. `store`: An observable, typically a store; or a function that receives props and
  returns an observable.

1. [`propName`]: The name of the prop that is passed to the child component.
  Defaults to "data".

## Returns

As all decorators a function that takes a child component and returns a
top level component wrapping it.

## Discussion

In Fluorine stores are observables, that emit values, that describe the store's state. The
decorator's only job is thus, subscribing to the store and injecting the consecutive values
into your component's prop.

In case you pass a function to the `store` argument, this function receives the top-level
component's props. This is for example helpful if the component you're building is
responsible for a single item, whose ID is to be passed. Your function might look as following.

```
props => dispatcher.reduce(TodoStore).pluck(props.id)
```

The underlying function is called again if the props change. In that case the subscription is
renewed as well.

## Example

### Usage with an observable

```js
import React, { Component } from 'react
import { withStore } from 'fluorine-lib'

import dispatcher from './dispatcher'
import TodoStore from './todo-store'

@withStore(dispatcher.reduce(TodoStore), 'todos')
export default class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {
          this.props.todos.map(todo => <li>{todo}</li>)
        }
      </ul>
    )
  }
}
```

### Usage with a function receiving props

```js
import React, { Component } from 'react
import { withStore } from 'fluorine-lib'

import dispatcher from './dispatcher'
import TodoStore from './todo-store'

@withStore(({ id }) => dispatcher
  .reduce(TodoStore)
  .pluck(id)
, 'todo')
export default class Todo extends React.Component {
  render() {
    return (
      <h1>
        {this.props.todo}
      </h1>
    )
  }
}
```

> Note: To use decorators in Babel with the "@-Syntax" you need to add a
> legacy decorator plugin. http://babeljs.io/docs/plugins/syntax-decorators/

