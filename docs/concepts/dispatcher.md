# Dispatcher

The **Dispatcher** is your application's event hub. It manages your ongoing
scheduled *agendas* and dispatched actions.

Conceptually the Dispatcher is the single source of truth in Fluorine. Every
store is derived from it.

> **For Flux users:** It is crucial to understand, that with Fluorine the
> Dispatcher is the central hub of your app's state. Instead of stores there are
> reducers which describe how a store is 'manufactured' from the event stream.

> **For Redux users:** Fluorine uses a central Dispatcher, which is not present
> in Redux apps. Instead of manufacturing a root store, you create a Dispatcher.
> Stores are anonymous Observables (Think 'streams') which emit the store's
> state.


