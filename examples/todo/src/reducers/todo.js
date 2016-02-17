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
    return state.filter(todo =>
      todo.id !== action.id
    )
  },
  [EDIT_TODO]: (state, action) => {
    return state.map(todo =>
      todo.id === action.id ?
        Object.assign({}, todo, { text: action.text }) :
        todo
    )
  },
  [COMPLETE_TODO]: (state, action) => {
    return state.map(todo =>
      todo.id === action.id ?
        Object.assign({}, todo, { completed: !todo.completed }) :
        todo
    )
  },
  [COMPLETE_ALL]: (state, action) => {
    const areAllMarked = state.every(todo => todo.completed)
    return state.map(todo => Object.assign({}, todo, {
      completed: !areAllMarked
    }))
  },
  [CLEAR_COMPLETED]: (state, action) => {
    return state.filter(todo => todo.completed === false)
  }
}

export default function todo(state = initialState, action) {
  return actions[action.type] ? actions[action.type](state, action) : state
}
