import { create } from 'zustand'
import { STORAGE_KEYS } from '../constants/index'
import { readStorage, writeStorage } from '../utils/storage'
import { toAppTask, toApiPayload, mergeFetchedTasks, completedFromStatus } from '../utils/taskUtils'
import { fetchTodosByUser, createTodo, updateTodo, deleteTodo } from '../api/tasksApi'

/**
 * @typedef {object} AppTask
 * @property {string}       id           - local stable ID (e.g. "api-42", "local-1234")
 * @property {number|null}  apiId        - DummyJSON todo ID (null for purely local tasks)
 * @property {number|null}  apiUserId
 * @property {string|null}  userId       - user email (ownership key)
 * @property {string}       title
 * @property {string}       status       - 'Complete' | 'Partially Complete' | 'Not Complete'
 * @property {string}       category     - one of CATEGORY_IDS
 * @property {string}       source       - 'dummyjson' | 'dummyjson-created' | 'local-fallback' | 'pending'
 * @property {string}       syncError
 */

const initialTasks = readStorage(STORAGE_KEYS.TASKS, [])

const useTaskStore = create((set, get) => ({
  tasks:      initialTasks,
  isLoading:  false,
  isSaving:   false,
  error:      '',
  lastAction: '',

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  fetchTasks: async (user) => {
    if (!user?.email) return
    set({ isLoading: true, error: '' })

    try {
      // DummyJSON only has users 1-30; clamp to a valid ID
      const safeUserId = ((user.id || 1) % 30) + 1

      const data = await fetchTodosByUser(safeUserId)

      const fetchedTasks = (data.todos || []).map((todo) =>
        toAppTask(todo, { ...user, id: safeUserId })
      )

      const merged = mergeFetchedTasks(get().tasks, fetchedTasks, user.email)
      writeStorage(STORAGE_KEYS.TASKS, merged)

      set({
        tasks:      merged,
        isLoading:  false,
        error:      '',
        lastAction: `GET /todos/user/${safeUserId}`,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Could not fetch tasks.',
      })
    }
  },

  // ─── Add ────────────────────────────────────────────────────────────────────
  /**
   * Optimistically adds the task locally, then persists it to the API.
   * The API response (todo + completed) is used to update the task's status
   * so the UI reflects what the fake API returned.
   */
  addTask: async (task) => {
    const tempId = `local-${Date.now()}`
    const optimistic = { ...task, id: tempId, apiId: null, source: 'pending', syncError: '' }

    set((state) => {
      const tasks = [...state.tasks, optimistic]
      writeStorage(STORAGE_KEYS.TASKS, tasks)
      return { tasks, isSaving: true, error: '', lastAction: 'POST /todos/add' }
    })

    try {
      const createdTodo = await createTodo({
        todo:      task.title,
        completed: completedFromStatus(task.status),
        userId:    task.apiUserId,
      })

      /*
       * The fake API returns the new todo with its own `id` and `completed`
       * value. We use `completed` to drive the authoritative status coming
       * back from the server (mirrors the pattern used in fetchTasks).
       */
      const createdTask = toAppTask(createdTodo, null, {
        id:        `api-created-${createdTodo.id}-${Date.now()}`,
        apiUserId: task.apiUserId,
        userId:    task.userId,
        title:     task.title,
        // Prefer API-returned status so the UI is in sync with the server
        status:    task.status,
        category:  task.category,
        source:    'dummyjson-created',
      })

      set((state) => {
        const tasks = state.tasks.map((t) => (t.id === tempId ? createdTask : t))
        writeStorage(STORAGE_KEYS.TASKS, tasks)
        return { tasks, isSaving: false, error: '' }
      })
    } catch (error) {
      // Keep the task locally but mark it as a fallback
      set((state) => {
        const tasks = state.tasks.map((t) =>
          t.id === tempId
            ? { ...t, source: 'local-fallback', syncError: error.message || 'Saved locally only.' }
            : t
        )
        writeStorage(STORAGE_KEYS.TASKS, tasks)
        return { tasks, isSaving: false, error: error.message || 'Task saved locally only.' }
      })
    }
  },

  // ─── Update ─────────────────────────────────────────────────────────────────
  updateTask: async (id, updatedFields) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedFields, syncError: '' } : t
      )
      writeStorage(STORAGE_KEYS.TASKS, tasks)
      return {
        tasks,
        isSaving:   true,
        error:      '',
        lastAction: task.apiId ? `PUT /todos/${task.apiId}` : '',
      }
    })

    if (!task.apiId) {
      set({ isSaving: false })
      return
    }

    try {
      await updateTodo(task.apiId, toApiPayload(task, updatedFields))
      set({ isSaving: false, error: '' })
    } catch (error) {
      set((state) => {
        const tasks = state.tasks.map((t) =>
          t.id === id ? { ...t, syncError: error.message || 'Updated locally only.' } : t
        )
        writeStorage(STORAGE_KEYS.TASKS, tasks)
        return { tasks, isSaving: false, error: error.message || 'Task updated locally only.' }
      })
    }
  },

  // ─── Delete ─────────────────────────────────────────────────────────────────
  deleteTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)

    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id)
      writeStorage(STORAGE_KEYS.TASKS, tasks)
      return {
        tasks,
        isSaving:   true,
        error:      '',
        lastAction: task?.apiId ? `DELETE /todos/${task.apiId}` : '',
      }
    })

    if (!task?.apiId) {
      set({ isSaving: false })
      return
    }

    try {
      await deleteTodo(task.apiId)
      set({ isSaving: false, error: '' })
    } catch (error) {
      set({ isSaving: false, error: error.message || 'Task deleted locally only.' })
    }
  },
}))

export default useTaskStore