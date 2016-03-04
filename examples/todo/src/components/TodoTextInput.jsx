import React, { Component, PropTypes } from 'react'

export default class TodoTextInput extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    editing: PropTypes.bool,
    newTodo: PropTypes.bool
  };

  static defaultProps = {
    text: ''
  };

  state = {
    text: this.props.text
  };

  handleSubmit = (e) => {
    const { onSave, newTodo } = this.props
    const text = e.target.value.trim()

    if (e.which === 13) {
      onSave(text)
      if (newTodo) {
        this.setState({ text: '' })
      }
    }
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value })
  };

  handleBlur = (e) => {
    const { onSave, newTodo } = this.props

    if (!newTodo) {
      onSave(e.target.value)
    }
  };

  render() {
    const { editing, newTodo, placeholder } = this.props
    const classes = `${editing && "edit"} ${newTodo && "new-todo"}`;

    return (
      <input
        className={classes}
        type="text"
        placeholder={placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit} />
    )
  }
}
