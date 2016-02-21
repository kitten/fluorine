import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from '../constants/todo'

import { fromJS, Map } from 'immutable';

const initialState = fromJS([
  {
    text: 'Learn Fluorine',
    completed: false,
    id: 0
  }
]);

export default function todo(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return state.push(new Map({
          id: state.reduce((maxId, todo) => Math.max(todo.get("id"), maxId), -1) + 1,
          completed: false,
          text: action.text
      }))

    case DELETE_TODO:
      return state.filter(todo =>
        todo.get("id") !== action.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.get("id") === action.id ?
          todo.set("text", action.text) :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.get("id") === action.id ?
          todo.set("completed", !todo.get("completed")) :
          todo
      )

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.get("completed"))
      return state.map(todo => todo.set("completed", !areAllMarked))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.get("completed") === false)

    default:
      return state
  }
}
