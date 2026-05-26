import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import TaskItem from './TaskItem'

const CATEGORIES = [
  {
    id: 'MyDay',
    label: 'My Day',
    icon: '☀️',
    gradient: 'from-yellow-400/10 to-orange-400/10',
    accent: 'bg-yellow-400',
    ring: 'ring-yellow-300',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    border: 'border-yellow-100',
    inputFocus: 'focus:ring-yellow-300',
    btnBg: 'bg-yellow-500 hover:bg-yellow-600',
  },
  {
    id: 'Work',
    label: 'Work',
    icon: '👨‍💻',
    gradient: 'from-violet-500/10 to-indigo-500/10',
    accent: 'bg-violet-500',
    ring: 'ring-violet-300',
    text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    border: 'border-violet-100',
    inputFocus: 'focus:ring-violet-300',
    btnBg: 'bg-violet-600 hover:bg-violet-700',
  },
  {
    id: 'Home',
    label: 'Home',
    icon: '🏠',
    gradient: 'from-sky-500/10 to-cyan-500/10',
    accent: 'bg-sky-500',
    ring: 'ring-sky-300',
    text: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    border: 'border-sky-100',
    inputFocus: 'focus:ring-sky-300',
    btnBg: 'bg-sky-600 hover:bg-sky-700',
  },
  {
    id: 'Groceries',
    label: 'Groceries',
    icon: '🍉',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accent: 'bg-emerald-500',
    ring: 'ring-emerald-300',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-100',
    inputFocus: 'focus:ring-emerald-300',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    id: 'Movies',
    label: 'Movies to watch',
    icon: '🍿',
    gradient: 'from-rose-500/10 to-pink-500/10',
    accent: 'bg-rose-500',
    ring: 'ring-rose-300',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    border: 'border-rose-100',
    inputFocus: 'focus:ring-rose-300',
    btnBg: 'bg-rose-600 hover:bg-rose-700',
  },
  {
    id: 'Places',
    label: 'Places to eat',
    icon: '🍔',
    gradient: 'from-amber-500/10 to-orange-500/10',
    accent: 'bg-amber-500',
    ring: 'ring-amber-300',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-100',
    inputFocus: 'focus:ring-amber-300',
    btnBg: 'bg-amber-600 hover:bg-amber-700',
  },
]

const CategoryModal = memo(function CategoryModal({ cat, tasks, onClose }) {
  const addTask = useTaskStore((s) => s.addTask)
  const user    = useAuthStore((s) => s.user)

  const [newTitle,  setNewTitle]  = useState('')
  const [newStatus, setNewStatus] = useState('Not Complete')

  const complete = tasks.filter((t) => t.status === 'Complete').length
  const progress = tasks.length > 0 ? Math.round((complete / tasks.length) * 100) : 0

  const handleAdd = useCallback(() => {
    if (!newTitle.trim()) return
    addTask({
      id: Date.now(),
      userId: user?.email,
      title: newTitle.trim(),
      status: newStatus,
      category: cat.id,
    })
    setNewTitle('')
    setNewStatus('Not Complete')
  }, [newTitle, newStatus, cat.id, user?.email, addTask])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg h-[92vh] md:max-h-[85vh] flex flex-col overflow-hidden border border-stone-100"
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${cat.gradient} px-4 md:px-6 pt-5 md:pt-6 pb-4 border-b ${cat.border} flex-shrink-0`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl leading-none" aria-hidden="true">{cat.icon}</span>
              <div>
                <h2 className={`text-lg md:text-xl font-bold ${cat.text}`}>{cat.label}</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} · {complete} done
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-700 transition-all text-sm shadow-xs"
            >
              ✕
            </button>
          </div>

          <div className="mt-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${cat.accent} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="px-4 md:px-5 py-4 border-b border-stone-100 flex-shrink-0 bg-stone-50/50">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Add to {cat.label}
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder={`New ${cat.label.toLowerCase()} task…`}
              aria-label={`New ${cat.label} task`}
              className={`w-full px-3 py-3 text-sm border border-stone-200 rounded-xl outline-none focus:ring-2 ${cat.inputFocus} bg-white text-stone-800 transition-all`}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                aria-label="Task status"
                className="flex-1 px-3 py-3 text-sm border border-stone-200 rounded-xl bg-white outline-none text-stone-700"
              >
                <option value="Not Complete">Not Complete</option>
                <option value="Partially Complete">Partially Complete</option>
                <option value="Complete">Complete</option>
              </select>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className={`${cat.btnBg} text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap`}
              >
                + Add Task
              </motion.button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">
              <p className="text-3xl mb-3" aria-hidden="true">✨</p>
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <TaskItem task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 md:px-5 py-3 border-t border-stone-100 bg-stone-50/50">
          {tasks.length > 0 && (
            <div className="flex flex-wrap gap-4 text-xs text-stone-500 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                {tasks.filter((t) => t.status === 'Complete').length} Complete
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                {tasks.filter((t) => t.status === 'Partially Complete').length} Partial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-300" aria-hidden="true" />
                {tasks.filter((t) => t.status === 'Not Complete').length} Open
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-black text-white py-3 rounded-xl text-sm font-semibold transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
})

const CategoryCard = memo(function CategoryCard({ cat, tasks, index, onOpen }) {
  const complete  = tasks.filter((t) => t.status === 'Complete').length
  const partial   = tasks.filter((t) => t.status === 'Partially Complete').length
  const remaining = tasks.filter((t) => t.status === 'Not Complete').length
  const progress  = tasks.length > 0 ? Math.round((complete / tasks.length) * 100) : 0

  const handleClick = useCallback(() => onOpen(cat.id), [cat.id, onOpen])

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 280, damping: 24 }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      aria-label={`Open ${cat.label} category`}
      className={`text-left w-full bg-gradient-to-br ${cat.gradient} border ${cat.border} rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 ${cat.ring}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl leading-none" aria-hidden="true">{cat.icon}</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cat.badge}`}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <p className={`font-bold text-base ${cat.text} mb-1`}>{cat.label}</p>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {[
          { label: 'Done',  count: complete,  dot: 'bg-emerald-500' },
          { label: 'Part',  count: partial,   dot: 'bg-amber-400'   },
          { label: 'Open',  count: remaining, dot: 'bg-stone-300'   },
        ].map(({ label, count, dot }) => (
          <span key={label} className="flex items-center gap-1 text-xs text-stone-500">
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
            {count} {label}
          </span>
        ))}
      </div>

      <div className="h-1 bg-white/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className={`h-full ${cat.accent} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.07 + 0.2 }}
        />
      </div>
      <p className="text-xs text-stone-400 mt-1.5 text-right">{progress}% complete</p>
    </motion.button>
  )
})

function CategoryCards() {
  const tasks   = useTaskStore((s) => s.tasks)
  const user    = useAuthStore((s) => s.user)
  const [openCatId, setOpenCatId] = useState(null)

  const userTasks   = tasks.filter((t) => t.userId === user?.email)
  const getTasksFor = useCallback(
    (catId) => userTasks.filter((t) => t.category === catId),
    [userTasks]
  )

  const handleOpen  = useCallback((id) => setOpenCatId(id), [])
  const handleClose = useCallback(() => setOpenCatId(null), [])

  const activeCat   = CATEGORIES.find((c) => c.id === openCatId)
  const activeTasks = openCatId ? getTasksFor(openCatId) : []

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            tasks={getTasksFor(cat.id)}
            index={i}
            onOpen={handleOpen}
          />
        ))}
      </div>

      <AnimatePresence>
        {openCatId && activeCat && (
          <CategoryModal
            cat={activeCat}
            tasks={activeTasks}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export { CATEGORIES }
export default CategoryCards