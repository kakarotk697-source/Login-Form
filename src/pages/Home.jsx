import { useState, useMemo, useCallback, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import useTaskStore from '../store/taskStore'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import CategoryNav from '../components/CategoryNav'
import CategoryCards from '../components/CategoryCards'
import { AnimatePresence, motion } from 'framer-motion'

const CATEGORIES = [
  { id: 'All',        label: 'All Tasks',         icon: '☀️'  },
  { id: 'MyDay',      label: 'My Day',            icon: '🌤️' },
  { id: 'Work',       label: 'Work',              icon: '👨‍💻' },
  { id: 'Home',       label: 'Home',              icon: '🏠'  },
  { id: 'Groceries',  label: 'Groceries',         icon: '🍉'  },
  { id: 'Movies',     label: 'Movies to watch',   icon: '🍿'  },
  { id: 'Places',     label: 'Places to eat',     icon: '🍔'  },
]

function Home() {
  const user  = useAuthStore((s) => s.user)
  const tasks = useTaskStore((s) => s.tasks)
  const fetchTasks = useTaskStore((s) => s.fetchTasks)
  const isLoadingTasks = useTaskStore((s) => s.isLoading)
  const isSavingTasks = useTaskStore((s) => s.isSaving)
  const taskError = useTaskStore((s) => s.error)

  const [selectedCategory,  setSelectedCategory]  = useState('All')
  const [isMobileMenuOpen,  setIsMobileMenuOpen]  = useState(false)
  const userId = user?.id
  const userEmail = user?.email

  useEffect(() => {
    if (userId && userEmail) {
      fetchTasks({ id: userId, email: userEmail })
    }
  }, [fetchTasks, userId, userEmail])

  const userTasks = useMemo(
    () => tasks.filter((t) => t.userId === user?.email),
    [tasks, user?.email]
  )

  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'All') return userTasks
    return userTasks.filter((t) => t.category === selectedCategory)
  }, [userTasks, selectedCategory])

  const totalTasks     = userTasks.length
  const completedCount = useMemo(() => userTasks.filter((t) => t.status === 'Complete').length,           [userTasks])
  const partialCount   = useMemo(() => userTasks.filter((t) => t.status === 'Partially Complete').length, [userTasks])
  const pendingCount   = useMemo(() => userTasks.filter((t) => t.status === 'Not Complete').length,       [userTasks])

  const getCategoryCount = useCallback((catId) => {
    if (catId === 'All') return userTasks.length
    return userTasks.filter((t) => t.category === catId).length
  }, [userTasks])

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), [])

  const currentLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.label

  const taskFormCategory = selectedCategory === 'All' ? 'MyDay' : selectedCategory

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">
              Hello, {user?.name || 'Friend'}!
            </h2>
            <p className="text-stone-500 text-sm mt-0.5">Organize your workflows cleanly.</p>
          </div>

          <CategoryNav
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            getCategoryCount={getCategoryCount}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuToggle={toggleMobileMenu}
          />
        </div>

        {(isLoadingTasks || isSavingTasks || taskError) && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
              taskError
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-emerald-100 bg-emerald-50 text-emerald-700'
            }`}
          >
            {taskError || (isLoadingTasks ? 'Loading your synced tasks...' : 'Saving changes...')}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: totalTasks,     color: 'text-stone-800',   accent: 'text-stone-400'   },
            { label: 'Complete',    value: completedCount, color: 'text-emerald-600', accent: 'text-emerald-500' },
            { label: 'Partial',     value: partialCount,   color: 'text-amber-600',   accent: 'text-amber-500'   },
            { label: 'Remaining',   value: pendingCount,   color: 'text-stone-700',   accent: 'text-stone-500'   },
          ].map(({ label, value, color, accent }) => (
            <div key={label} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
              <p className={`text-xs font-bold uppercase tracking-wider ${accent}`}>{label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Category Cards — desktop only */}
        <div className="hidden md:block mb-2">
          <h3 className="text-stone-700 font-bold text-xs tracking-wide uppercase mb-4 px-1">
            Categories
          </h3>
          <CategoryCards />
        </div>

        <TaskForm currentCategory={taskFormCategory} />

        {/* Task list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-stone-700 font-bold text-sm tracking-wide uppercase">
              {currentLabel} Agenda
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
