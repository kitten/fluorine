function strTime(date) {
  return `${date.toLocaleTimeString('en-GB')}.${date.getMilliseconds()}`
}

export function parseOpts(logging) {
  const opts = {
    agendas: false,
    stores: false
  }

  if (typeof logging === 'object') {
    opts.agendas = logging.agendas
    opts.stores = logging.stores
  } else if (logging) {
    opts.agendas = true
    opts.stores = true
  }

  return opts
}

const agendaGroupHead = (agenda, timestamp) => (prepend = '') => {
  const timestampEnd = new Date()
  const title = `Agenda ${agenda.constructor.name} @ ${strTime(timestamp)} (in ${timestampEnd - timestamp}ms)`

  if (console.groupCollapsed) {
    console.groupCollapsed(`%c ${prepend + title}`, 'color: #111111;')
  }

  console.log('%c agenda', 'color: #9e9e9e; font-weight: bold;', agenda)
}

export function logAgendas(dispatcher) {
  dispatcher.subscribe(agenda => {
    const logStart = agendaGroupHead(agenda, new Date())
    let errBucket

    agenda
      .scan((bucket, action) => bucket.concat([ action ]), [])
      .do(bucket => {
        errBucket = bucket
      })
      .last()
      .subscribe(actions => {
        logStart()

        actions.forEach(action => {
          console.log('%c action', 'color: #03a9f4; font-weight: bold;', action)
        })

        if (console.groupEnd && console.groupCollapsed) {
          console.groupEnd()
        }
      }, error => {
        logStart('Error ')

        console.log('%c error', 'color: #f20404; font-weight: bold;', error)
        console.log('%c dispatched actions', 'color: #03a9f4; font-weight: bold;', errBucket)

        if (console.groupEnd && console.groupCollapsed) {
          console.groupEnd()
        }
      })
  })
}

export const logStore = (name, agenda) => ({
  change(action, state) {
    const timestamp = new Date()
    const title = `Store ${name} @ ${strTime(timestamp)}`

    if (console.groupCollapsed) {
      console.groupCollapsed(`%c ${title}`, 'color: #111111;')
    }
    console.log('%c agenda', 'color: #9e9e9e; font-weight: bold;', agenda)
    console.log('%c action', 'color: #03a9f4; font-weight: bold;', action)
    console.log('%c change', 'color: #4caf50; font-weight: bold;', state)

    if (console.groupCollapsed && console.groupEnd) {
      console.groupEnd()
    }
  },
  revert(states, error, bucket) {
    const timestamp = new Date()
    const title = `Revert ${name} @ ${strTime(timestamp)}`

    const [ prevState, state ] = states

    if (console.groupCollapsed) {
      console.groupCollapsed(`%c ${title}`, 'color: #f20404;')
    }

    console.log('%c agenda', 'color: #9e9e9e; font-weight: bold;', agenda)
    console.log('%c previous', 'color: #4caf50; font-weight: bold;', prevState)
    console.log('%c state', 'color: #4caf50; font-weight: bold;', state)

    console.log('%c error', 'color: #f20404; font-weight: bold;', error)
    console.log('%c bucket', 'color: #03a9f4; font-weight: bold;', bucket)

    if (console.groupCollapsed && console.groupEnd) {
      console.groupEnd()
    }
  }
})

