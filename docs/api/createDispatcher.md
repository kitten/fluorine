# `createDispatcher()`

Creates a Dispatcher.

See ["Dispatcher"](Dispatcher.md) for more information on the Dispatcher itself.

## Arguments

1. `options`: An object containing certain options, that change the properties
  of the resulting dispatcher

## Returns

A [**Dispatcher**](Dispatcher.md)

## Usage as a Singleton

The easiest way to use the dispatcher is as a singleton. The file holding it
could for example be named `dispatcher.js`:

```js
import {
  createDispatcher
} from 'fluorine-lib'

const dispatcher = createDispatcher()

export const reduce = dispatcher.reduce
export const schedule = dispatcher.schedule
export const wrapActions = dispatcher.wrapActions
export default dispatcher
```

## Options

You can pass in options into the method like so:
`createDispatcher({ option: true })`

Possible options at the time are:

- `scheduler`: You can pass an RxJS Scheduler to change the behavior of how
  agendas are scheduled on the dispatcher. The default is `Rx.Scheduler.asap`

- `logging`: This is very useful for development! By default this is `false` and
  you can either just pass `true` to enable all logging or pass an object to only
  enable specific logging. This object has the form:
  `{ agendas: true, stores: true }`

