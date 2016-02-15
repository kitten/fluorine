import React, { Component } from 'react'
import { render } from 'react-dom'
import 'todomvc-app-css/index.css'

import Container from './components/Container'

class App extends Component {
  render() {
    return (
      <Container/>
    )
  }
}

render(<App />, document.getElementById('root'))
