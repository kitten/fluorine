import { createDispatcher } from 'fluorine-lib'
import thunk from 'fluorine-lib/lib/middleware/thunk'

const dispatcher = createDispatcher({
  logging: true
}, thunk)

export default dispatcher

