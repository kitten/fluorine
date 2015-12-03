# `createDispatcher()`

Creates a Dispatcher for our application. See ["Dispatcher"](Dispatcher.md) for more information
on the Dispatcher itself.

## Returns

[**Dispatcher:**](Dispatcher.md)

An object, that is an interface to an event stream. You may inject new events by
dispatching actions or generate new stores.

## Usage

There should be a module on your app, which exclusively holds the Dispatcher,
optimally it should be called `dispatcher.js`. Plainly, this creates and exports
a new dispatcher, so that it may be used in other parts of your apps, namely
components.

```js
import {
  createDispatcher
} from 'fluorine-lib'

export default createDispatcher()
```
