const __DEV__ = (process.env.NODE_ENV !== 'production')

export default function warn(msg) {
  let hasWarned = false

  return () => {
    if (__DEV__ && !hasWarned && console.warn) {
      console.warn(msg)
      hasWarned = true
    }
  }
}

