# `createDispatcher()`

Creates a Dispatcher.

See ["Dispatcher"](dispatcher.md) for more information on the Dispatcher itself.

## Arguments

1. `options`: An object containing certain options, that change the properties
  of the resulting dispatcher

## Returns

A [**Dispatcher**](dispatcher.md)

## Usage as a Singleton

The easiest way to use the dispatcher is as a singleton. The file holding it
could for example be named `dispatcher.js`:

```js
import {
  createDispatcher
} from 'fluorine-lib'

const dispatcher = createDispatcher()

export const reduce = dispatcher.reduce
export const next = dispatcher.schedule
export const wrapActions = dispatcher.wrapActions
export default dispatcher
```

## Usage with a Provider

A dispatcher can be distributed via a Provider. This ensures that
your components don't rely on local singletons and are easily testable.

The Provider passes a dispatcher down via the context, optionally
with a observable. This means that this is ell suited for mono-store
as well as multi-store setups.

Check out the [**Provider**](provider.md) for more information on
this.

## Options

You can pass in `opts` into `createDispatcher`:

```js
createDispatcher({logging: true})
```

Available options:

- `scheduler`: You can pass an RxJS Scheduler to change the behavior of how
  agendas are scheduled on the dispatcher. The default is `Rx.Scheduler.asap`

- `logging`: This is very useful for development! By default this is `false` and
  you can either pass `true` to enable all logging or pass an object to only
  enable specific logging. This object has the form:
  `{ agendas: true, stores: true }`

