import connectStore from './connectStore'
import warn from './util/warn'

const _withStoreNotice = warn('The `withStore` decorator is deprecated. Please use `connect` instead.')

export default function withStore(store, prop = 'data') {
  _withStoreNotice()

  if (typeof store === 'function') {
    return connectStore((_, props) => store(props), prop)
  }

  return connectStore(store, prop)
}

