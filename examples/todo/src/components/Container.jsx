import React, { Component, PropTypes } from 'react'

import Header from './Header.jsx'
import MainSection from './MainSection.jsx'

export default class Container extends Component {
  render() {
    return (
      <div>
        <Header/>
        <MainSection/>
      </div>
    )
  }
}
