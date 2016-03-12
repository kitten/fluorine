import connect from './connect'

// The withStore decorator is deprecated and will be deleted in favor
// for the connect decorator soon
export default function withStore(store, prop = 'data') {
  if (typeof store === 'function') {
    return connect((_, props) => store(props), prop)
  }

  return connect(store, prop)
}

