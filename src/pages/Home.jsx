import { useState } from 'react'
import useAuthStore from '../store/authStore'
import useTaskStore from '../store/taskStore'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import { AnimatePresence, motion } from 'framer-motion'

function Home() {
  const { user } = useAuthStore()
  const { tasks } = useTaskStore()

  const categories = [
    { id: 'All', label: 'My Day', icon: '☀️' },
    { id: 'Work', label: 'Work', icon: '👨‍💻' },
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Groceries', label: 'Groceries', icon: '🍉' },
    { id: 'Movies', label: 'Movies to watch', icon: '🍿' },
    { id: 'Places', label: 'Places to eat', icon: '🍔' },
  ]

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userTasks = tasks.filter((t) => t.userId === user?.email)
  
  const filteredTasks = userTasks.filter((t) => {
    if (selectedCategory === 'All') return true
    return t.category === selectedCategory
  })

  const totalTasks = userTasks.length
  const completedCount = userTasks.filter((t) => t.status === 'Complete').length
  const partialCount = userTasks.filter((t) => t.status === 'Partially Complete').length
  const pendingCount = userTasks.filter((t) => t.status === 'Not Complete').length

  const getCategoryCount = (catId) => {
    if (catId === 'All') return userTasks.length
    return userTasks.filter((t) => t.category === catId).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">
              Hello, {user?.name || 'Friend'}!
            </h2>
            <p className="text-stone-500 text-sm mt-0.5">
              Organize your workflows cleanly.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 bg-white shadow-sm border border-stone-200 rounded-xl gap-1.5 focus:outline-none z-50"
          >
            <span className={`h-0.5 w-5 bg-stone-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-5 bg-stone-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 bg-stone-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </motion.button>
        </div>

        <div className="hidden md:flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl border border-stone-100 shadow-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-100 text-stone-500'}`}>
                  {getCategoryCount(cat.id)}
                </span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white rounded-2xl border border-stone-100 shadow-md p-3 mb-6 flex flex-col gap-1"
            >
              <p className="text-xs font-bold uppercase text-stone-400 px-3 py-1 tracking-wider">Lists & Folders</p>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setIsMobileMenuOpen(false) 
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-md text-stone-500 font-bold">
                      {getCategoryCount(cat.id)}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-bold text-stone-800 mt-0.5">{totalTasks}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Complete</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{completedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Partial</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{partialCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Remaining</p>
            <p className="text-2xl font-bold text-stone-700 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <TaskForm currentCategory={selectedCategory === 'All' ? 'Work' : selectedCategory} />

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-stone-700 font-bold text-sm tracking-wide uppercase">
              {categories.find((c) => c.id === selectedCategory)?.label} Agenda
            </h4>
            <span className="text-xs text-stone-400 font-medium font-mono">
              Showing {filteredTasks.length} elements
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <motion.div 
              layout
              className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-200 text-stone-400 text-sm shadow-2xs"
            >
              ✨ No entries logged inside this bucket. Time to relax or schedule a clean task!
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home