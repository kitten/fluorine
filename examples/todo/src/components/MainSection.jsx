import React, { Component, PropTypes } from 'react'
import { withStore } from 'fluorine-lib'
import todo from '../reducers/todo'
import dispatcher from '../dispatcher'
import * as todoActions from '../actions/todo'

const {
  clearCompleted,
  completeAll
} = dispatcher.wrapActions(todoActions)

import TodoItem from './TodoItem'
import Footer from './Footer'

import { List } from 'immutable'

const TODO_FILTERS = {
  SHOW_ALL: () => true,
  SHOW_ACTIVE: todo => !todo.get("completed"),
  SHOW_COMPLETED: todo => todo.get("completed")
}

@withStore(dispatcher.reduce(todo), "todos")
export default class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.instanceOf(List).isRequired
  };

  state = {
    filter: "SHOW_ALL"
  };

  handleClearCompleted = () => {
    clearCompleted()
  };

  handleShow = (filter) => {
    this.setState({ filter })
  };

  renderToggleAll(completedCount) {
    const { todos } = this.props
    if (todos.size > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.size}
               onChange={completeAll} />
      )
    }
  }

  renderFooter(completedCount) {
    const { todos } = this.props
    const { filter } = this.state
    const activeCount = todos.size - completedCount

    if (todos.size) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={this.handleClearCompleted}
                onShow={this.handleShow} />
      )
    }
  }

  render() {

    const { todos } = this.props
    const { filter } = this.state

    const filteredTodos = todos.filter(TODO_FILTERS[filter])
    const completedCount = todos.reduce((count, todo) =>
      todo.get("completed") ? count + 1 : count,
      0
    )

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.get("id")} todo={todo}/>
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}
