# createDispatcher()

Creates a new [Dispatcher](dispatcher.md).

See [Dispatcher](dispatcher.md) for more information on the Dispatcher itself.

## Arguments

- [`options`]: An object containing certain options, that change the properties
  of the resulting dispatcher.

- [`middlewares`]: An array containing your middleware functions.

## Returns

A new [Dispatcher](dispatcher.md)

## Discussion

This function creates a new dispatcher and returns it. It can be passed some
options that change the resulting dispatcher.

```js
{
  logging: false,
  scheduler: Scheduler.queue
}
```

### Logging

In development you might want to log agendas, stores or both. You can change the
logging behavior of a dispatcher using the `logging` option.

To enable logging for both agendas and stores pass `true`.

You can enable/disable logging for agendas and stores separately by passing an
object to the option.

```js
{
  logging: {
    agendas: true,
    stores: true
  }
}
```

### Scheduler

Normally all agendas are scheduled on the default `Scheduler.queue`. You can pass
the `scheduler` option a scheduler of your choice.

### Middlewares

You can pass it middleware to modify agendas inside the dispatcher pipeline.
Middleware have a `dispatcher => agenda => result` pattern. They are being
passed the dispatcher and the agenda. The result of this function is the
actual agenda that is being passed on to either the next middleware, or the
stores.

## Examples

### Usage as a singleton

If you don't want to unit test components, that use the dispatcher, then you can
create your dispatcher as a singleton.

```js
import { createDispatcher } from 'fluorine-lib'

const dispatcher = createDispatcher()

export const next = dispatcher.next
export const reduce = dispatcher.reduce
export default dispatcher
```

### Usage with Provider

In case you need to unit test components, you will want to use the dispatcher
dynamically and not juse import it when you need it. For that purpose Fluorine
has `Provider` and the `connectStore` decorators.

The `Provider` creates a dispatcher automatically, but feel free to pass it
your own dispatcher, when your app starts.

```js
import React, { Component } from 'react'
import { createDispatcher } from 'fluorine-lib'

class Main extends Component {
  dispatcher = createDispatcher()

  render() {
    return (
      <Provider dispatcher={this.dispatcher}>
        <App/>
      </Provider>
    )
  }
}
```

