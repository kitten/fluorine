import connectStore from './connectStore'

export default function withStore(store, prop = 'data') {
  if (typeof store === 'function') {
    return connectStore((_, props) => store(props), prop)
  }

  return connectStore(store, prop)
}

