# Observable#distinctSelector()

Creates a new [Dispatcher](dispatcher.md).
Since there are a lot of situations where the structure of the projects demands
combining stores into a single Observable (See combineStores and combineReducers),
a new operator has to be added to Rx that allows them to be split up again.

This method is being added to the Rx Observable prototype inside Fluorine's
`index.js` file.

You would normally use it on an observable that emits an object, containing all the
states of your stores. This is a common technique, to use the multiple stores
in Fluorine in a mono-store setup.

## Arguments

- [`keys`]: An array of strings, that are keys of the objects, emitted by the
  Observable.

## Returns

A new Observable, that still emits objects, but filtered for the `keys` that
have been passed.

## Discussion

Imagine that your Observable emits objects like these

```js
{
  users: [X],
  comments: [Y],
  posts: [Z]
}
```

And you would like to use this observable inside a component that lists only
comments and their users. You would want to get rid of the posts, since
you don't want the component to rerender when the posts change.

```
obs.distinctSelector([ 'users', 'comments' ])
// Emits:
{
  users: [X],
  comments: [Y]
}
```

This checks whether the values inside the objects for the `keys` that you've passed
changed or not, and emits objects filtered by these `keys`.

## Examples

You're most likely going to use this inside a [connectStore](connectStore.md) selector.

```js
import React, { Component } from 'react'
import { connectStore } from 'fluorine-lib'

@connectStore(store => store.distinctSelector([ 'test' ]))

class Main extends Component {
  render() {
    return this.props.data.test
  }
}
```

