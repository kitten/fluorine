import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from '../actions/todo'

const initialState = [
  {
    text: 'Learn Fluorine',
    completed: false,
    id: 0
  }
]

const actions = {
  [ADD_TODO]: (state, action) => {
    return [
      {
        id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
        completed: false,
        text: action.text
      }, 
      ...state
    ]
  },
  [DELETE_TODO]: (state, action) => {

  }
}

export default function todo(state = initialState, action) {
  // switch (action.type) {
  //   case ADD_TODO:
  //     return state + 1
  //   case DELETE_TODO:
  //     return state - 1
  //   default:
  //     return state
  // }
}
