import React, { Component, PropTypes } from 'react'
import { withStore, withActions } from 'fluorine-lib'
import TodoTextInput from './TodoTextInput'

export default class HeaderComp extends Component {
  static propTypes = {
  };

  handleSave = (text) => {
    if (text.length !== 0) {
      this.props.addTodo(text)
    }
  };

  render() {
    return (
      <header className="header">
          <h1>todos</h1>
          <TodoTextInput newTodo
                         onSave={this.handleSave}
                         placeholder="What needs to be done?" />
      </header>
    )
  }
}
