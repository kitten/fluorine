<p align="center"><img src="https://raw.githubusercontent.com/philpl/fluorine/master/docs/fluorine-flasky-2x.gif" width=400></p>
<p align="center">
<strong>Flexible state and side effect manager using <a href="https://github.com/Reactive-Extensions/RxJS">RxJS</a> for <a href="https://facebook.github.io/react/">React</a>.</strong>
<br><br>
<a href="https://travis-ci.org/philpl/fluorine"><img alt="TravisCI" src="https://travis-ci.org/philpl/fluorine.svg"></a>
<a href="https://slack.fluorinejs.org/"><img alt="Join Fluorine's Slack!" src="https://slack.fluorinejs.org/badge.svg"></a>
<a href="https://npmjs.com/package/fluorine-lib"><img src="https://img.shields.io/npm/dm/fluorine-lib.svg"></a>
<a href="https://npmjs.com/package/fluorine-lib"><img src="https://img.shields.io/npm/v/fluorine-lib.svg"></a>
<br>
<iframe src="https://ghbtns.com/github-btn.html?user=philpl&repo=fluorine&type=star&count=true&size=large" frameborder="0" scrolling="0" width="140px" height="30px"></iframe>
</p>

Fluorine provides you with easy, reactive state and side effect management,
accumulating stores from streams of actions and side effects.

It builds on the ideas of Redux, while preserving a Flux-like Dispatcher
as the single source of truth.

- Your stores are directly reduced from the dispatcher and actions are dispatched on it
- Manage your side effect as Observables ("Agendas") with automatic rollbacks on error
- Unopinionated and simple API

This is the ultimate way to use RxJS for state and side effect management!

