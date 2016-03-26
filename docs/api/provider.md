# Provider

A React component that makes a dispatcher and an observable available
to lower components in the context.

## Props

- [`dispatcher`]: A dispatcher. Will be created, if you don't pass one.

- [`observable`]: Either an observable, typically a store; or a function that receives
  a dispatcher and returns an observable.

## Discussion

This provides an observer and observable to `connectStore`. This is different to using a
singleton dispatcher, in that this enables easy unit testing.

The Provider provides an observer child context, which is a dispatcher stripped down to an
observer; and an observable, that can be a store reduced from the dispatcher.

If you don't pass an `observable` prop the observable child context will automatically be
the dispatcher.

Ultimately what the observable child context contains, will be given a function that you
pass to [connectStore](connectStore.md).

If you're using a mono-store setup (One reducer contains all others) you will want to make
the observable child context contain your store. If you're using a multi-store setup (Multiple
reducers that are imported on demand) you will want to make the observable child context
contain your dispatcher.

## Example

### Usage with a mono-store structure

```js
import React, { Component } from 'react'
import IndexStore from './stores/index'

class Main extends Component {
  render() {
    return (
      <Provider observable={({ reduce }) => reduce(IndexStore)}>
        <App/>
      </Provider>
    )
  }
}
```

### Usage with a multi-store structure

In this case you don't need to pass any props to Provider, since you'd import your stores in
the components, where you need them.

```js
import React, { Component } from 'react'

class Main extends Component {
  render() {
    return (
      <Provider>
        <App/>
      </Provider>
    )
  }
}
```

### Explicitly passing a dispatcher

If you want to create the dispatcher with certain options, or want to keep it around for other
reasons, you will want to explicitly pass Provider your dispatcher. Note that the following
code won't actually work.

```js
import YourStore from './stores/your-store'
const dispatcher = createDispatcher()

<Provider
  dispatcher={dispatcher}
  observable={dispatcher.reduce(YourStore)}>
  <App/>
</Provider>
```

You can of course use a function for observable as well, which will receive your dispatcher
as an argument.

```js
import YourStore from './stores/your-store'
const dispatcher = createDispatcher()

<Provider
  dispatcher={dispatcher}
  observable={({ reduce }) => reduce(YourStore)}>
  <App/>
</Provider>
```

