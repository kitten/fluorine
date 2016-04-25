# connectStore

A decorator that wraps a React component. It receives an observer and an
observable from a Provider above, and gives the React component
the changing value from the observable (like withStore) and the
observer.

This decorator is very similar in usage to [withStore](withStore.md), but it can be
used in combination with a Provider, which is its primary purpose.

## Arguments

- `store`: Either an observable, typically a store; or a function returning an observable
  that receives the observable context (from a upper Provider) and props.

- [`propName`]: The name of the prop that is passed to the child component.
  Defaults to "data".

- [`pureProps`]: Whether the component should check for reference equality before
  rendering. Defaults to `true`.

## Returns

As all decorators a function that takes a child component and returns a
top level component wrapping it.

## Discussion

As this decorator is similar to [withStore](withStore.md#discussion), take a look there
at the Discussion section as well.

In case you pass a function to the `store` argument, this function receives two arguments:

1. The observable context from your upper Provider. This is what you've passed to the
  Provider's `observable` prop, or what the function you passed to it returns. In case there
  is no upper Provider, this argument is `undefined`.

2. The top-level component's props.

In a mono-store setup you'd probably want to transform the store that you get as a first
argument. In a multi-store setup you'd want to reduce the dispatcher that you get as a first
argument to a specific store.

## Example

We will provide two examples that correspond to the examples, that you can find on the
[Provider examples](provider.md#example). You have to read these in parallel to make sense of
them.

The example below are written so that their results are identical, which should give you
an idea of how this decorator works, and whether you want to implement a mono- or a multi-store
structure on your project.

### Usage with a mono-store structure

```js
import React, { Component } from 'react'
import { connectStore } from 'fluorine-lib'

@connectStore(store => store.pluck('text), 'text')
class App extends Component {
  render() {
    return <div>{this.props.text}</div>
  }
}
```

### Usage with a multi-store structure

```js
import React, { Component } from 'react'
import { connectStore } from 'fluorine-lib'

import IndexStore from './stores/index'

@connectStore(({ reduce }) => reduce(IndexStore).pluck('text'), 'text')
class App extends Component {
  render() {
    return <div>{this.props.text}</div>
  }
}
```

