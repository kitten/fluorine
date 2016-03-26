# Contributing to Fluorine

Thanks for your interest in committing to Fluorine! :sparkling_heart:

This document doesn't contain rules, but merely tries to define some guidelines and
give some instructions on how to contribute best.

## What do I need to know to help?

### Code of Conduct

You're expected to comply to our [Code of Conduct](CODE_OF_CONDUCT.md).
Please don't forget to read it and report any unacceptable behavior or
issues to a contributor.

### Skills

Besides knowing your way around ES6, you should be familiar with
[Babel](https://babeljs.io),
[React](https://reactjs.com), and
[RxJS v5](https://github.com/ReactiveX/RxJS).

Don't hestitate to ask for help on our Slack or in issues if you need
some help with these libraries.

## Issues

Generally, for all *bugs*, *questions* and *suggestions* you should open
an issue on GitHub: [New Issue](https://github.com/philpl/fluorine/issues/new)

We use it to discuss and track issues that require resolving.

Before opening new issues, please make sure that a similar one wasn't
opened already. The search functionality will be the most helpful tool
to do that. Consider asking another contributor if you're unsure,
whether the issue was resolved before.

Remember that issues work best for:

- Reporting bugs
- Asking questions, that concern every user
- Suggesting improvements
- Suggesting changes

But not for:

- Getting help
- Resolving problems with your personal setup

## Getting Help

If you run into any problems, that don't concern every user, if you need
some help getting started, if you've got some smaller questions, or
if you need help solving a special problem, then...

[**Join our Slack**](https://slack.fluorinejs.org)

We're always trying to help. Slack gives us the possibilty to communicate
efficently as a community, as well as chatting in groups.

## Code Contributions

Go to our [GitHub Issues](https://github.com/philpl/fluorine/issues) and
check whether some issues need to be resolved. See if someone is already
working on it, and assign yourself to the issue, if you want to resolve
it yourself.

Fork and clone the repository. You might also want to checkout a new
branch, or add the original Fluorine repo as an upstream remote?

### Building Fluorine

Don't forget to install the dependencies.

```
npm install
```

Running the `build` task will build Fluorine's source four times.

- ES Build (Babel)
- CommonJS Build (Babel)
- UMD File (Webpack + Babel)
- Uglified UMD File (Webpack + Babel)

```
npm run build
```

You might be interested to only build the CommonJS build:

```
npm run build:commonjs
```

### Linting and Testing

We're trying to adhere to a certain coding style. Please lint your
code before you're trying to get it merged.

You can execute the eslint task using the `lint` task.

```
npm run lint
```

To run our unit tests use the `test` task. Note that the `test` task
will run the `lint` task as well as build the source using the `build:commonjs`
task.

```
npm run test
```

## Contributing to the Documentation

No matter whether you just found a single typo, want to improve the wording of some
sentences, or want to write entire docs, **contributions to the documentation are
always welcome!**

We're using gitbook, which builds from our documentation inside `docs/`. You can install
the current gitbook version using the `prebook` task.

```
npm run prebook
```

To build the actual book run the `book` task.

```
npm run book
```

To watch `docs/` and rebuild the book accordingly use the `book:watch` task. It will
serve the book at `localhost:4000`.

```
npm run book:watch
```

## Writing and Updating Examples

We appreciate your demos and examples, that show newcomers how to use Fluorine.
Don't hestitate to open PRs for your examples.

Please base those off of one of the eisting examples to make usage easier.

