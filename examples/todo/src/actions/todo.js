import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from '../constants/todo'

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function deleteTodo(id) {
  return { type: DELETE_TODO, id }
}

export function editTodo(id, text) {
  return { type: EDIT_TODO, id, text }
}

export function completeTodo(id) {
  return { type: COMPLETE_TODO, id }
}

export function completeAll() {
  return { type: COMPLETE_ALL }
}

export function clearCompleted() {
  return { type: CLEAR_COMPLETED }
}

