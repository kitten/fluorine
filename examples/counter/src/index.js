import React, { Component } from 'react'
import { render } from 'react-dom'

import Counter from './components/Counter'

class App extends Component {
  render() {
    return (
      <Counter/>
    )
  }
}

render(<App />, document.getElementById('root'))
