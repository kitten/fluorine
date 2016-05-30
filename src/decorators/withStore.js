import connectStore from './connectStore'

export default function withStore(store, prop = 'data', pureProps = true) {
  if (typeof store === 'function') {
    return connectStore((_, props) => store(props), prop, pureProps)
  }

  return connectStore(store, prop, pureProps)
}

