import { useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import useTaskStore from '../../store/taskStore'
import { STATUS_STYLES } from '../../constants/index'


const TaskItem = memo(function TaskItem({ task }) {
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const updateTask = useTaskStore((s) => s.updateTask)

  const [isEditing,   setIsEditing]   = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  const handleSave = useCallback(() => {
    const trimmed = editedTitle.trim()
    if (trimmed) {
      updateTask(task.id, { title: trimmed })
      setIsEditing(false)
    }
  }, [editedTitle, task.id, updateTask])

  const handleStatusChange = useCallback(
    (e) => updateTask(task.id, { status: e.target.value }),
    [task.id, updateTask]
  )

  const handleDelete = useCallback(
    () => deleteTask(task.id),
    [task.id, deleteTask]
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-stone-100 p-4 rounded-xl flex items-center justify-between shadow-xs gap-4"
    >
      {/* Title / edit input */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 p-1.5 border border-emerald-400 rounded-lg outline-none text-sm"
            aria-label="Edit task title"
            autoFocus
          />
        ) : (
          <p
            className={`text-sm font-medium truncate ${
              task.status === 'Complete' ? 'line-through text-stone-400' : 'text-stone-800'
            }`}
          >
            {task.title}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <select
          value={task.status}
          onChange={handleStatusChange}
          aria-label="Task status"
          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium outline-none ${STATUS_STYLES[task.status]}`}
        >
          <option value="Complete">Complete</option>
          <option value="Partially Complete">Partially Complete</option>
          <option value="Not Complete">Not Complete</option>
        </select>

        {isEditing ? (
          <button
            onClick={handleSave}
            aria-label="Save task"
            className="text-xs bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg font-medium"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="text-xs text-stone-500 hover:bg-stone-100 p-1.5 rounded-lg transition-all"
          >
            ✏️
          </button>
        )}

        <button
          onClick={handleDelete}
          aria-label="Delete task"
          className="text-xs text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition-all"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  )
})

export default TaskItem