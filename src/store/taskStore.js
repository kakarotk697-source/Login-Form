import { create } from 'zustand'

const stored = localStorage.getItem('app_tasks')
const initialTasks = stored ? JSON.parse(stored) : []

const useTaskStore = create((set) => ({
  tasks: initialTasks,

  addTask: (task) =>
    set((state) => {
      const updatedTasks = [...state.tasks, task]
      localStorage.setItem('app_tasks', JSON.stringify(updatedTasks))
      return { tasks: updatedTasks }
    }),

  deleteTask: (id) =>
    set((state) => {
      const updatedTasks = state.tasks.filter((task) => task.id !== id)
      localStorage.setItem('app_tasks', JSON.stringify(updatedTasks))
      return { tasks: updatedTasks }
    }),

  updateTask: (id, updatedFields) =>
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
      localStorage.setItem('app_tasks', JSON.stringify(updatedTasks))
      return { tasks: updatedTasks }
    }),
}))

export default useTaskStore