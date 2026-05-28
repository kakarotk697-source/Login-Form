import { motion, AnimatePresence } from 'framer-motion'
import { NAV_CATEGORIES } from '../../constants/index'


function CategoryNav({
  selectedCategory,
  onSelect,
  getCategoryCount,
  isMobileMenuOpen,
  onMobileMenuToggle,
}) {
  return (
    <div className="relative w-full">
      {/* Mobile Top Bar  */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-stone-800">
          {NAV_CATEGORIES.find((cat) => cat.id === selectedCategory)?.label}
        </h2>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onMobileMenuToggle}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="relative z-50 flex flex-col justify-center items-center w-11 h-11 bg-white shadow-sm border border-stone-200 rounded-xl gap-1.5"
        >
          {[
            isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5',
            isMobileMenuOpen ? 'opacity-0' : 'opacity-100',
            isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5',
          ].map((cls, i) => (
            <span
              key={i}
              className={`absolute h-0.5 w-5 bg-stone-700 rounded-full transition-all duration-300 ${cls}`}
            />
          ))}
        </motion.button>
      </div>

      {/*  Mobile Slide Menu  */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileMenuToggle}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 z-50 md:hidden bg-white rounded-2xl border border-stone-200 shadow-xl p-3 flex flex-col gap-1"
            >
              <p className="text-xs font-bold uppercase text-stone-400 px-3 py-1 tracking-wider">
                Lists &amp; Folders
              </p>

              {NAV_CATEGORIES.map((cat) => {
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

export default CategoryNav