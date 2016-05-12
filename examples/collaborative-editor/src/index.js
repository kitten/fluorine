import React, { Component } from 'react'
import { render } from 'react-dom'

import { Provider } from 'fluorine-lib'

import dispatcher from './dispatcher'
import Counter from './components/Counter'

class App extends Component {
  render() {
    return (
      <Provider dispatcher={dispatcher}>
        <Counter/>
      </Provider>
    )
  }
}

render(<App />, document.getElementById('root'))
