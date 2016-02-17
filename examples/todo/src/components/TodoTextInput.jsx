import React, { Component, PropTypes } from 'react'
import { withStore, withActions } from 'fluorine-lib'

// import dispatcher from '../dispatcher'
// import counter from '../reducers/counter'
// import * as CounterActions from '../actions/counter'

// @withStore(dispatcher.reduce(counter), 'counter')
// @withActions(dispatcher, CounterActions)

export default class TodoTextInput extends Component {
  static propTypes = {
  };

  state = {
    text: this.props.text || ''
  };

  handleSubmit(e) {
    const text = e.target.value.trim()
    if (e.which === 13) {
      this.props.onSave(text)
      if (this.props.newTodo) {
        this.setState({ text: '' })
      }
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleBlur(e) {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value)
    }
  }

  render() {

    let classes = `${this.props.editing && "edit"} ${this.props.newTodo && "new-todo"}`;

    return (
      <input
        className={classes}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)} />
    )
  }
}
