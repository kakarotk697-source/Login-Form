//  Storage Keys 
export const STORAGE_KEYS = {
  USERS: 'registered_users',
  SESSION: 'current_session_user',
  TASKS: 'app_tasks',
}

//  Categories 
export const CATEGORY_IDS = ['MyDay', 'Work', 'Home', 'Groceries', 'Movies', 'Places']

export const CATEGORIES = [
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

// Navigation categories 
export const NAV_CATEGORIES = [
  { id: 'All',       label: 'All Tasks',        icon: '☀️'  },
  { id: 'MyDay',     label: 'My Day',           icon: '🌤️' },
  { id: 'Work',      label: 'Work',             icon: '👨‍💻' },
  { id: 'Home',      label: 'Home',             icon: '🏠'  },
  { id: 'Groceries', label: 'Groceries',        icon: '🍉'  },
  { id: 'Movies',    label: 'Movies to watch',  icon: '🍿'  },
  { id: 'Places',    label: 'Places to eat',    icon: '🍔'  },
]

//  Task Status 
export const TASK_STATUS = {
  COMPLETE: 'Complete',
  PARTIAL: 'Partially Complete',
  NOT_COMPLETE: 'Not Complete',
}

export const STATUS_STYLES = {
  [TASK_STATUS.COMPLETE]:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  [TASK_STATUS.PARTIAL]:      'bg-amber-50 text-amber-700 border-amber-200',
  [TASK_STATUS.NOT_COMPLETE]: 'bg-stone-50 text-stone-600 border-stone-200',
}