import { motion, AnimatePresence } from 'framer-motion'

const categories =  [
  { id: 'All',       label: 'My Day',         icon: '☀️' },
  { id: 'MyDay',     label: 'My Day Tasks',   icon: '🌤️' },
  { id: 'Work',      label: 'Work',           icon: '👨‍💻' },
  { id: 'Home',      label: 'Home',           icon: '🏠' },
  { id: 'Groceries', label: 'Groceries',      icon: '🍉' },
  { id: 'Movies',    label: 'Movies to watch',icon: '🍿' },
  { id: 'Places',    label: 'Places to eat',  icon: '🍔' },
]



function CategoryNav({
  selectedCategory,
  onSelect,
  getCategoryCount,
  isMobileMenuOpen,
  onMobileMenuToggle,
}) {
  return (
    <div className="relative w-full">
      {/* ───────────────────────────────────────── */}
      {/* Desktop Categories */}
      {/* Hidden completely on mobile */}
      {/* ───────────────────────────────────────── */}
      {/* <div className="hidden md:flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl border border-stone-100 shadow-xs">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id

          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{cat.icon}</span>

              <span>{cat.label}</span>

              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  isActive
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {getCategoryCount(cat.id)}
              </span>
            </motion.button>
          )
        })}
      </div> */}

      {/* ───────────────────────────────────────── */}
      {/* Mobile Top Bar */}
      {/* ───────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-stone-800">
          {categories.find((cat) => cat.id === selectedCategory)?.label}
        </h2>

        {/* Hamburger / Cross Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onMobileMenuToggle}
          className="relative z-50 flex flex-col justify-center items-center w-11 h-11 bg-white shadow-sm border border-stone-200 rounded-xl gap-1.5"
        >
          <span
            className={`absolute h-0.5 w-5 bg-stone-700 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />

          <span
            className={`absolute h-0.5 w-5 bg-stone-700 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />

          <span
            className={`absolute h-0.5 w-5 bg-stone-700 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </motion.button>
      </div>

      {/* ───────────────────────────────────────── */}
      {/* Mobile Menu */}
      {/* ───────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileMenuToggle}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />

            {/* Slide Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 z-50 md:hidden bg-white rounded-2xl border border-stone-200 shadow-xl p-3 flex flex-col gap-1"
            >
              <p className="text-xs font-bold uppercase text-stone-400 px-3 py-1 tracking-wider">
                Lists & Folders
              </p>

              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id

                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelect(cat.id)
                      onMobileMenuToggle()
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-stone-600 hover:bg-stone-50'
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

              {/* Close Button */}
              <button
                onClick={onMobileMenuToggle}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-semibold transition-all"
              >
                OK
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export { categories }
export default CategoryNav