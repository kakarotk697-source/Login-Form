import { useState } from 'react'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import { motion } from 'framer-motion'

function TaskForm({ currentCategory }) {
  const { addTask } = useTaskStore()
  const { user } = useAuthStore()

  const [task, setTask] = useState('')
  const [status, setStatus] = useState('Not Complete')
  const [category, setCategory] = useState(currentCategory || 'Work')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!task.trim()) return

    addTask({
      id: Date.now(),
      userId: user?.email,
      title: task,
      status,
      category: currentCategory === 'Work' || currentCategory === 'All' ? category : currentCategory,
    })

    setTask('')
    setStatus('Not Complete')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-xs mb-8">
      <h3 className="text-stone-700 font-bold mb-3 text-xs tracking-wide uppercase">Add New Entry</h3>
      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="text"
          placeholder="What are you working on today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 transition-all text-stone-800 text-sm"
        />

        <div className="grid grid-cols-2 lg:flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-3 border border-stone-200 rounded-xl bg-stone-50 outline-none focus:ring-2 focus:ring-emerald-300 text-stone-700 text-sm w-full"
          >
            <option value="Complete">Complete</option>
            <option value="Partially Complete">Partially Complete</option>
            <option value="Not Complete">Not Complete</option>
          </select>

          <select
            value={currentCategory === 'All' ? category : currentCategory}
            disabled={currentCategory !== 'All'}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-stone-200 rounded-xl bg-stone-50 outline-none focus:ring-2 focus:ring-emerald-300 text-stone-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
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