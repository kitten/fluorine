import React, { Component, PropTypes } from 'react'
import TodoTextInput from './TodoTextInput'
import dispatcher from '../dispatcher'
import * as todoActions from '../actions/todo'

const {
  completeTodo,
  deleteTodo,
  editTodo
} = dispatcher.wrapActions(todoActions)

import { Map } from 'immutable'

export default class TodoItem extends Component {

  static propTypes = {
    todo: PropTypes.instanceOf(Map).isRequired
  };

  state = {
    editing: false
  };

  handleDoubleClick = () => {
    this.setState({ editing: true })
  };

  handleSave(id, text) {
    if (text.length === 0) {
      deleteTodo(id)
    } else {
      editTodo(id, text)
    }
    this.setState({ editing: false })
  }

  getEditingInput() {
    const { todo } = this.props
    const { editing } = this.state

    return (
        <TodoTextInput text={todo.get("text")}
                       editing={editing}
                       onSave={this.handleSave.bind(this, todo.get("id"))} />
    )
  }

  getNormalInput() {
    const { todo } = this.props

    return (
      <div className="view">
        <input className="toggle"
               type="checkbox"
               checked={todo.get("completed")}
               onChange={completeTodo.bind(this, todo.get("id"))} />
        <label onDoubleClick={this.handleDoubleClick}>
          {todo.get("text")}
        </label>
        <button className="destroy"
                onClick={deleteTodo.bind(this, todo.get("id"))} />
      </div>
    )
  }

  render() {
    const { todo } = this.props

    return (
      <li className={`${todo.get("completed") && "completed"} ${this.state.editing && "editing"}`}>
        {
          this.state.editing ? this.getEditingInput() : this.getNormalInput()
        }
      </li>
    )
  }
}
