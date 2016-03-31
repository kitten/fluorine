# connectActions

A decorator that wraps a React component. It receives an observer from a
Provider above, and passes action creators through to
[wrapActions](wrapActions.md), whose result is given to the React component
as a prop.

This decorator is very similar in usage to [withActions](withActions.md), but
it gets its observer from a Provider instead.

## Arguments

- `actions`: Either an action creator; or an array, or object containing
  action creators.

- [`propName`]: The name of the prop that is passed to the child component.
  Defaults to "actions".

## Returns

As all decorators a function that takes a child component and returns a
top level component wrapping it.

## Example

We will provide two examples that correspond to the examples, that you can find on the
[Provider examples](provider.md#example). You have to read these in parallel to make sense of
them.

```js
import React, { Component, PropTypes } from 'react
import { withActions } from 'fluorine-lib'

import {
  addTodo
} from '../actions/todos'
import dispatcher from './dispatcher'

@connectActions({
  addTodo
}, 'actions')

export default class YourComponent extends Component {
  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func)
  }

  render() {
    const { addTodo } = this.props.actions

    return (
      <button onClick={addTodo}>
        Do something!
      </button>
    )
  }
}
```

> Note: To use decorators in Babel with the "@-Syntax" you need to add a
> legacy decorator plugin. http://babeljs.io/docs/plugins/syntax-decorators/

