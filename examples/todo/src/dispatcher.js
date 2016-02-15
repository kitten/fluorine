import { createDispatcher } from 'fluorine-lib'

const dispatcher = createDispatcher({
  logging: true
})

export const dispatch = dispatcher.dispatch
export const schedule = dispatcher.schedule
export default dispatcher
