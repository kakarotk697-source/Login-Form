import { useState } from 'react'
import useTaskStore from '../store/taskStore'
import { motion } from 'framer-motion'

function TaskItem({ task }) {
  const { deleteTask, updateTask } = useTaskStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTask(task.id, { title: editedTitle })
      setIsEditing(false)
    }
  }

  const statusStyles = {
    'Complete': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Partially Complete': 'bg-amber-50 text-amber-700 border-amber-200',
    'Not Complete': 'bg-stone-50 text-stone-600 border-stone-200'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-stone-100 p-4 rounded-xl flex items-center justify-between shadow-xs gap-4"
    >
      <div className="flex-1 flex items-center gap-3">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 p-1.5 border border-emerald-400 rounded-lg outline-none text-sm"
            autoFocus
          />
        ) : (
          <p className={`text-sm font-medium ${task.status === 'Complete' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
            {task.title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value })}
          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium outline-none ${statusStyles[task.status]}`}
        >
          <option value="Complete">Complete</option>
          <option value="Partially Complete">Partially Complete</option>
          <option value="Not Complete">Not Complete</option>
        </select>

        {isEditing ? (
          <button onClick={handleSave} className="text-xs bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg font-medium">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-xs text-stone-500 hover:bg-stone-100 p-1.5 rounded-lg transition-all">
            ✏️
          </button>
        )}

        <button 
          onClick={() => deleteTask(task.id)} 
          className="text-xs text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition-all"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  )
}

export default TaskItem