# wrapActions()

Returns the action creators that were passed but wraps them to dispatch
their return values on an observer, typically a dispatcher.

Each [Dispatcher](dispatcher.md) also has a `wrapActions` method that
has itself bound to this function as the first argument.

## Arguments

- `observer`: An Observer.
- `actions`: Either an action creator; or an array, or object containing
  action creators.

## Returns

In case an action creator was passed in, a function is returned that wraps the
action creator. The function passes arguments on and calls the observer's
next method with the returned action. The following code shows the wrapping
function.

[src/util/wrapActions.js](https://github.com/philpl/fluorine/blob/master/src/util/wrapActions.js#L7)

```js
// `fn` is the action creator
const transform = fn => (...args) => observer.next(fn(...args))
```

In case an array containing only action creators is passed, a new array is
returned, containing wrapped action creators.

In case an object containing only action creators is passed, a new object is
returned, containing wrapped action creators under identical keys.

## Discussion

You might use this method passively via the `wrapActions` method on a
dispatcher, when you use the dispatcher as a singleton. Or you might use
it directly if you use the dispatcher via a Provider, since you'd only
have an observer then.

In case you use agendas exclusively you wouldn't have to wrap action creators
at all. You'd of course still use it if you use agenda creators.

## Example

```js
import React, { Component, PropTypes } from 'react
import { wrapActions } from 'fluorine-lib'

import {
  addTodo
} from '../actions/todos'
import dispatcher from './dispatcher'

export default class YourComponent extends Component {
  render() {
    const _addTodo = wrapActions(dispatcher, addTodo)
    // or: dispatcher.wrapActions(addTodo)

    return (
      <button onClick={_addTodo}>
        Do something!
      </button>
    )
  }
}
```

