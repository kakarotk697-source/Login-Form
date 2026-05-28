
import { CATEGORY_IDS, TASK_STATUS } from '../constants/index'


export const getCategoryForTodo = (todoId) => {
  const id = Number(todoId)
  if (!Number.isFinite(id)) return 'MyDay'
  return CATEGORY_IDS[id % CATEGORY_IDS.length]
}


export const statusFromCompleted = (completed) =>
  completed ? TASK_STATUS.COMPLETE : TASK_STATUS.NOT_COMPLETE


export const completedFromStatus = (status) => status === TASK_STATUS.COMPLETE


export const toAppTask = (todo, user, overrides = {}) => {
  const apiId = Number(todo.id || overrides.apiId)
  const hasApiId = Number.isFinite(apiId)

  return {
    id: overrides.id || (hasApiId ? `api-${apiId}` : `local-${Date.now()}`),
    apiId: hasApiId ? apiId : null,
    apiUserId: user?.id || todo.userId || overrides.apiUserId || null,
    userId: user?.email || overrides.userId || todo.userEmail || null,
    title: overrides.title || todo.todo || todo.title || '',
    status: overrides.status || statusFromCompleted(todo.completed),
    category: overrides.category || todo.category || getCategoryForTodo(todo.id),
    source: overrides.source || 'dummyjson',
    syncError: '',
  }
}


export const toApiPayload = (task, fields = {}) => {
  const next = { ...task, ...fields }
  const payload = {}
  if ('title' in next) payload.todo = next.title
  if ('status' in next) payload.completed = completedFromStatus(next.status)
  return payload
}


export const mergeFetchedTasks = (existingTasks, fetchedTasks, userEmail) => {
  const fetchedApiIds = new Set(
    fetchedTasks.map((t) => String(t.apiId)).filter(Boolean)
  )

  const otherUsersTasks = existingTasks.filter((t) => t.userId !== userEmail)
  const localOnlyTasks = existingTasks.filter((t) => {
    if (t.userId !== userEmail) return false
    if (t.source === 'dummyjson') return false
    return !t.apiId || !fetchedApiIds.has(String(t.apiId))
  })

  return [...otherUsersTasks, ...fetchedTasks, ...localOnlyTasks]
}