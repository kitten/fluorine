import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from '../actions/todo'

import { fromJS, Map } from 'immutable';

const initialState = fromJS([
  {
    text: 'Learn Fluorine',
    completed: false,
    id: 0
  }
]);

const actions = {
  [ADD_TODO]: (state, action) => {
    return state.push(new Map({
        id: state.reduce((maxId, todo) => Math.max(todo.get("id"), maxId), -1) + 1,
        completed: false,
        text: action.text
    }))
  },
  [DELETE_TODO]: (state, action) => {
    return state.filter(todo =>
      todo.get("id") !== action.id
    )
  },
  [EDIT_TODO]: (state, action) => {
    return state.map(todo =>
      todo.get("id") === action.id ?
        todo.set("text", action.text) :
        todo
    )
  },
  [COMPLETE_TODO]: (state, action) => {
    return state.map(todo =>
      todo.get("id") === action.id ?
        todo.set("completed", !todo.get("completed")) :
        todo
    )
  },
  [COMPLETE_ALL]: (state, action) => {
    const areAllMarked = state.every(todo => todo.get("completed"))
    return state.map(todo => todo.set("completed", !areAllMarked))
  },
  [CLEAR_COMPLETED]: (state, action) => {
    return state.filter(todo => todo.get("completed") === false)
  }
}

export default function todo(state = initialState, action) {
  return actions[action.type] ? actions[action.type](state, action) : state
}
