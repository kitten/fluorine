# Structure

Before you jump in and use Fluorine here's some advices on how to
structure your React projects to perfectly use it.

Some advices are general ones that apply to Flux and Redux projects
as well, some are specific to Fluorine.

In this document we will refer to the *"project root"* as your
projects uppermost directory and to the *"source (root)"* as your
directory in the project root containing your source code JS files.
This is most commonly named `src/`.

## Directory Structure

You should add three directories to your source:

* `constants` - For your action types.
  This is a generally useful directory for several usages and
  it's used in a lot of React projects.
* `reducers` - For your reducers.
  In Flux projects this is directory is instead called `stores`, but
  stores and reducers are conceptually different. This is why it
  makes sense to use this directory name instead. For the difference
  between reducers and stores consult the glossary.
* `actions` - For your agendas and action creators.

```
project/
└── src/
    ├── constants/
    ├── reducers/
    └─ actions/
```

## Dispatcher Singleton

You can create a dispatcher very easily by using `.createDispatcher()`.
It doesn't take much:

```js
import { createDispatcher } from 'fluorine-lib'

const dispatcher = createDispatcher()
```

The bigger question is: *How do you pass the dispatcher to the places
where it's used?*

The easiest solution is to use a singleton. A file in your source
does the trick. It should live at `src/dispatcher.js` or similar.

```js
import { createDispatcher } from 'fluorine-lib'

export default createDispatcher()
```

This has the advantage that it's very easy and straightforward.

Use it anywhere you want just by importing it:

```js
import dispatcher from './dispatcher'

dispatcher.reduce(...)
// ...
```

In case you only use the `reduce()` and `schedule()` methods, which
can be the case if you don't use action creators, it is advantageous
to export these methods directly:

```
import { createDispatcher } from 'fluorine-lib

const dispatcher = createDispatcher()

export const reduce = dispatcher.reduce
export const schedule = dispatcher.schedule
export const wrapActions = dispatcher.wrapActions
export default dispatcher
```

This enables you to shorten some of your code tremendously, if you
plan not to use the `withStore` and `withActions` decorators.

For more information and help on the decorators and the pros and cons
consult the concepts page for them: Decorators

## Continue to read

The next part in the introduction is on the basic concepts of Fluorine
[Concepts](concepts.md)

