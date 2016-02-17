import { createDispatcher } from 'fluorine-lib'

const dispatcher = createDispatcher({
  logging: true
})

export const reduce = dispatcher.reduce
export const schedule = dispatcher.schedule
export default dispatcher

