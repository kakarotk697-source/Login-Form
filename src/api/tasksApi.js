
import { apiRequest } from './client'


export const fetchTodosByUser = async (userId) =>
  apiRequest(`/todos/user/${userId}`)


export const createTodo = async (payload) =>
  apiRequest('/todos/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })


export const updateTodo = async (todoId, payload) =>
  apiRequest(`/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })


export const deleteTodo = async (todoId) =>
  apiRequest(`/todos/${todoId}`, { method: 'DELETE' })