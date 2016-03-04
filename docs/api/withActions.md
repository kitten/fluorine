# `withActions(dispatcher, actions, [prop])`

This is a decorator that can be used to insert ready-to-use actions into your
component.

Actions are supposed to be written as pure functions for composability. However, the
result needs to be dispatched somehow. `withActions` is a decorator that injects an
object containing actions into your component as a prop and wraps them in a
function that injects the result into the [`dispatch`](Dispatcher.md#dispatch)
method.

## Arguments

1. `dispatcher`: This is the dispatcher that you want to dispatch your actions
  on.

1. `actions`: This is your object containing pure functions, that return your
  plain object actions.

1. `prop` (Optional): This is the prop where the wrapped actions are going to be
  passed into your child component. Defaults to: `actions`

## Returns

A function that takes the child component and returns a top-level component
that wraps it.

## Example

### ES6 with Decorator Syntax

```js
// ...
import { withActions } from 'fluorine-lib'
import * as actions from './actions'
import dispatcher from './dispatcher'

@withActions(dispatcher, actions)
export default class YourComponent extends React.Component {
  render() {
    return (
      <button onClick={this.props.actions.doSomething}>
        Do something!
      </button>
    )
  }
}
```

The actions used in this example might look something like this:

```
export function doSomething() {
  return {
    type: 'DO_SOMETHING'
  }
}
```

Note that the import instruction `* as actions` transforms all of the exports
into a single object.

## ES5

```js
// ...
var withActions = require('fluorine-lib').withActions
var actions = require('./actions')
var dispatcher = require('./dispatcher')

var YourComponent = React.createClass({
  render: function() {
    return (
      <button onClick={this.props.actions.doSomething}>
        Do something!
      </button>
    )
  }
})

module.exports = withActions(dispatcher, actions)(YourComponent)
```

With the actions for the ES5 example looking something like this:

```js
module.exports = {
  doSomething: function() {
    return {
      type: 'DO_SOMETHING'
    }
  }
}
```

## A note on Babel

To use decorators in Babel you need to enable them. You can find instructions on
how to enable a decorator plugin here:

http://babeljs.io/docs/plugins/syntax-decorators/
