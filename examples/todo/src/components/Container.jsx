import React, { Component, PropTypes } from 'react'
import { withStore, withActions } from 'fluorine-lib'
import Header from './Header.jsx'
import MainSection from './MainSection.jsx'
import dispatcher from '../dispatcher'
import todo from '../reducers/todo'
import * as todoActions from '../actions/todo'

@withStore(dispatcher.reduce(todo), "todos")
@withActions(dispatcher, todoActions)
export default class Container extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { todos, actions } = this.props;

    return (
      <div>
        <Header/>
        <MainSection/>
      </div>
    )
  }
}
