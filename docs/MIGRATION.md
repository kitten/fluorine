# Migrating to Version 4

Version 4 brings some powerful changes! Among them are:

- Compatibility with all ES7 Observable-spec libraries
- Performance improvements and runtime tweaks
- More support for mono-store setups including a new operator
- Middleware!

Let's go through changes that might affect you.

## Middleware and Thunks

The dispatcher doesn't support **thunks** by default as of
this version! This means that you have to add the thunk middleware
to your dispatcher.

Before you might have had something like this.

```
import { createDispatcher } from 'fluorine-lib'
const dispatcher = createDispatcher({
  logging: true
})
```

This is what the functionally same dispatcher looks like now.

```
import { createDispatcher } from 'fluorine-lib'
import thunk from 'fluorine-lib/lib/middleware/thunk'

const dispatcher = createDispatcher({
  logging: true
}, [
  thunk
])
```

This is an exciting change, since it opens up lots of
possibilities to extend and improve Fluorine on your end!

A simple example of this is the `createThunkMiddleware` function
that you can use, to pass your thunks more arguments.

```
import { createThunkMiddleware } from 'fluorine-lib/lib/middleware/thunk'

// This middleware:
createThunkMiddleware(request)

// Results in thunks like these:
(next, reduce, request) => {}
```

## ES7 Observable-spec libraries

This might be interesting if you don't want to use the
exact version of RxJS 5 that Fluorine uses. Or if you'd
like to use an entirely different Observable library.

This shouldn't affect you at all and you don't have to
do anything.

## Mono-store setups

For mono-stores we've got some utilities to make your app more
performant, and your life easier.

If you've used something like `reduce(rootReducer)` in your thunk,
you might know the pain and problems. You don't get the correct changes
that you want, and you have to explicitly get the attribute of your choice.

The `combineReducers` helper helps you to replace your "root reducer", that
is very similar to Redux, with an Observable that combines multiple stores.
Thus you get the best of multi-store and mono-store setups.

Furthermore to only get the changes that you need from your mono-store observable,
there is now a `distinctSelector` helper. You pass it an array of keys, and it
plucks all the values inside the objects that are emitted from your mono-store,
and returns an object only containing your selected keys. It also ignores every
change that doesn't apply to your selected attributes. Woohoo!

## Deprecated methods were now removed

The methods `schedule` and `dispatch` were now removed for good! Please use `next`
instead.

