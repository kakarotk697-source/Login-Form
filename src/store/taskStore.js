import { create } from 'zustand'

const API_BASE_URL = 'https://dummyjson.com'
const TASKS_KEY = 'app_tasks'
const CATEGORY_IDS = ['MyDay', 'Work', 'Home', 'Groceries', 'Movies', 'Places']

const readTasks = () => {
  try {
    const stored = localStorage.getItem(TASKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const persistTasks = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'The API request failed.')
  }

  return data
}

const getCategoryForTodo = (todoId) => {
  const id = Number(todoId)
  if (!Number.isFinite(id)) return 'MyDay'
  return CATEGORY_IDS[id % CATEGORY_IDS.length]
}

const statusFromCompleted = (completed) => {
  if (completed) return 'Complete'
  return 'Not Complete'
}

const completedFromStatus = (status) => status === 'Complete'

const toAppTask = (todo, user, overrides = {}) => {
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

const mergeFetchedTasks = (existingTasks, fetchedTasks, userEmail) => {
  const fetchedApiIds = new Set(
    fetchedTasks.map((task) => String(task.apiId)).filter(Boolean)
  )

  const otherUsersTasks = existingTasks.filter((task) => task.userId !== userEmail)
  const localUserTasks = existingTasks.filter((task) => {
    if (task.userId !== userEmail) return false
    if (task.source === 'dummyjson') return false
    return !task.apiId || !fetchedApiIds.has(String(task.apiId))
  })

  return [...otherUsersTasks, ...fetchedTasks, ...localUserTasks]
}

const toApiPayload = (task, fields = {}) => {
  const nextTask = { ...task, ...fields }
  const payload = {}

  if ('title' in nextTask) {
    payload.todo = nextTask.title
  }

  if ('status' in nextTask) {
    payload.completed = completedFromStatus(nextTask.status)
  }

  return payload
}

const initialTasks = readTasks()

const useTaskStore = create((set, get) => ({
  tasks: initialTasks,
  isLoading: false,
  isSaving: false,
  error: '',
  lastAction: '',

  fetchTasks: async (user) => {
    if (!user?.id || !user?.email) return

    set({ isLoading: true, error: '' })

    try {
      const data = await apiRequest(`/todos/user/${user.id}`)
      const fetchedTasks = (data.todos || []).map((todo) => toAppTask(todo, user))
      const tasks = mergeFetchedTasks(get().tasks, fetchedTasks, user.email)

      persistTasks(tasks)
      set({
        tasks,
        isLoading: false,
        error: '',
        lastAction: `GET /todos/user/${user.id}`,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Could not fetch tasks from the API.',
      })
    }
  },

  addTask: async (task) => {
    const tempId = `local-${Date.now()}`
    const optimisticTask = {
      ...task,
      id: tempId,
      apiId: null,
      source: 'pending',
      syncError: '',
    }

    set((state) => {
      const tasks = [...state.tasks, optimisticTask]
      persistTasks(tasks)
      return {
        tasks,
        isSaving: true,
        error: '',
        lastAction: 'POST /todos/add',
      }
    })

    try {
      const createdTodo = await apiRequest('/todos/add', {
        method: 'POST',
        body: JSON.stringify({
          todo: task.title,
          completed: completedFromStatus(task.status),
          userId: task.apiUserId,
        }),
      })

      const createdTask = toAppTask(createdTodo, null, {
        id: `api-created-${createdTodo.id}-${Date.now()}`,
        apiUserId: task.apiUserId,
        userId: task.userId,
        title: task.title,
        status: task.status,
        category: task.category,
        source: 'dummyjson-created',
      })

      set((state) => {
        const tasks = state.tasks.map((item) =>
          item.id === tempId ? createdTask : item
        )
        persistTasks(tasks)
        return { tasks, isSaving: false, error: '' }
      })
    } catch (error) {
      set((state) => {
        const tasks = state.tasks.map((item) =>
          item.id === tempId
            ? {
                ...item,
                source: 'local-fallback',
                syncError: error.message || 'Saved locally only.',
              }
            : item
        )
        persistTasks(tasks)
        return {
          tasks,
          isSaving: false,
          error: error.message || 'Task was saved locally only.',
        }
      })
    }
  },

  deleteTask: async (id) => {
    const task = get().tasks.find((item) => item.id === id)

    set((state) => {
      const tasks = state.tasks.filter((item) => item.id !== id)
      persistTasks(tasks)
      return {
        tasks,
        isSaving: true,
        error: '',
        lastAction: task?.apiId ? `DELETE /todos/${task.apiId}` : '',
      }
    })

    if (!task?.apiId) {
      set({ isSaving: false })
      return
    }

    try {
      await apiRequest(`/todos/${task.apiId}`, { method: 'DELETE' })
      set({ isSaving: false, error: '' })
    } catch (error) {
      set({
        isSaving: false,
        error: error.message || 'Task was deleted locally only.',
      })
    }
  },

  updateTask: async (id, updatedFields) => {
    const task = get().tasks.find((item) => item.id === id)
    if (!task) return

    set((state) => {
      const tasks = state.tasks.map((item) =>
        item.id === id ? { ...item, ...updatedFields, syncError: '' } : item
      )
      persistTasks(tasks)
      return {
        tasks,
        isSaving: true,
        error: '',
        lastAction: task.apiId ? `PUT /todos/${task.apiId}` : '',
      }
    })

    if (!task.apiId) {
      set({ isSaving: false })
      return
    }

    try {
      await apiRequest(`/todos/${task.apiId}`, {
        method: 'PUT',
        body: JSON.stringify(toApiPayload(task, updatedFields)),
      })
      set({ isSaving: false, error: '' })
    } catch (error) {
      set((state) => {
        const tasks = state.tasks.map((item) =>
          item.id === id
            ? {
                ...item,
                syncError: error.message || 'Updated locally only.',
              }
            : item
        )
        persistTasks(tasks)
        return {
          tasks,
          isSaving: false,
          error: error.message || 'Task was updated locally only.',
        }
      })
    }
  },
}))

export default useTaskStore
