# `withStore(store, [prop])`

This is a decorator that can be used to insert a store's state into your
component.

This decorator injects values of an observable into a prop of your choice
and updates it. Your component will always receive the store's latest state
through a top-level component.

## Arguments

1. `store`: The store (Observable) to inject.

1. `prop` (Optional): This is the prop where the state is going to be passed
  into your child component. Defaults to: `data`

## Returns

A function that takes the child component and returns a top-level component
that wraps it.

## Example

### ES6 with Decorator Syntax

```js
// ...
import { withStore } from 'fluorine-lib'
import dispatcher from './dispatcher'
import TodoStore from './todo-store'

@withStore(dispatcher.reduce(TodoStore), 'todos')
export default class YourComponent extends React.Component {
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

## ES5

```js
// ...
var withStore = require('fluorine-lib').withStore
var dispatcher = require('./dispatcher')
var TodoStore = require('./todo-store'

var YourComponent = React.createClass({
  render> function() {
    return (
      <ul>
        {
          this.props.todos.map(function(todo) {
            return <li>{todo}</li>
          })
        }
      </ul>
    )
  }
})

module.exports = withStore(dispatcher.reduce(TodoStore), 'todos')(YourComponent)
```

## A note on Babel

To use decorators in Babel you need to enable them. You can find instructions on
how to enable a decorator plugin here:

http://babeljs.io/docs/plugins/syntax-decorators/
