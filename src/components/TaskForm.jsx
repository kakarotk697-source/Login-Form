import { useState, useCallback, useEffect } from 'react'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import { motion } from 'framer-motion'

function TaskForm({ currentCategory }) {
  const addTask = useTaskStore((s) => s.addTask)
  const user    = useAuthStore((s) => s.user)

  const [task,     setTask]     = useState('')
  const [status,   setStatus]   = useState('Not Complete')
  const [category, setCategory] = useState(currentCategory || 'MyDay')

  // Sync category when prop changes (e.g. user switches filter)
  useEffect(() => {
    if (currentCategory && currentCategory !== 'All') {
      setCategory(currentCategory)
    }
  }, [currentCategory])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!task.trim()) return

    addTask({
      userId: user?.email,
      apiUserId: user?.id,
      title: task.trim(),
      status,
      category: currentCategory === 'All' || currentCategory === 'MyDay' ? category : currentCategory,
    })

    setTask('')
    setStatus('Not Complete')
  }, [task, status, category, currentCategory, user?.email, user?.id, addTask])

  const isAllView = currentCategory === 'All'

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-xs mb-8">
      <h3 className="text-stone-700 font-bold mb-3 text-xs tracking-wide uppercase">Add New Entry</h3>
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="text"
          placeholder="What are you working on today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          aria-label="New task title"
          className="flex-1 p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 transition-all text-stone-800 text-sm"
        />

        <div className="grid grid-cols-2 lg:flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Task status"
            className="p-3 border border-stone-200 rounded-xl bg-stone-50 outline-none focus:ring-2 focus:ring-emerald-300 text-stone-700 text-sm w-full"
          >
            <option value="Complete">Complete</option>
            <option value="Partially Complete">Partially Complete</option>
            <option value="Not Complete">Not Complete</option>
          </select>

          <select
            value={isAllView ? category : currentCategory}
            disabled={!isAllView}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Task category"
            className="p-3 border border-stone-200 rounded-xl bg-stone-50 outline-none focus:ring-2 focus:ring-emerald-300 text-stone-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
            <option value="MyDay">☀️ My Day</option>
            <option value="Work">Work</option>
            <option value="Home">Home</option>
            <option value="Groceries">Groceries</option>
            <option value="Movies">Movies to watch</option>
            <option value="Places">Places to eat</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 font-semibold text-white px-6 py-3 rounded-xl transition-all text-sm shadow-sm whitespace-nowrap cursor-pointer"
        >
          Add Task
        </motion.button>
      </div>
    </form>
  )
}

export default TaskForm
