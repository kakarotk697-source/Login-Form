import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../store/authStore'
import AvatarPicker from '../avatar/AvatarPicker'

function Navbar() {
  const { logout, updateProfilePicture } = useAuthStore()
  const user      = useAuthStore((state) => state.user)
  const navigate  = useNavigate()

  const [showImgSection, setShowImgSection] = useState(false)
  const [tempAvatar,     setTempAvatar]     = useState(null)
  const [avatarSize,     setAvatarSize]     = useState('medium')

  const avatarNavbarSizes = {
    small:  'w-8 h-8',
    medium: 'w-10 h-10 sm:w-12 sm:h-12',
    large:  'w-14 h-14 sm:w-16 sm:h-16',
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const saveAvatarChange = async () => {
    if (tempAvatar) await updateProfilePicture(tempAvatar)
    setShowImgSection(false)
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-stone-100 shadow-sm px-6 py-4 flex flex-col rounded-2xl mb-8 transition-all duration-300">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
            ✓
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent hidden sm:block">
            ToDo
          </h1>
        </div>

        {/* Right side: avatar + user info + logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImgSection(!showImgSection)}
              title="Click to edit avatar"
              className={`${avatarNavbarSizes[avatarSize]} rounded-full overflow-hidden bg-stone-100 border cursor-pointer flex-shrink-0 transition-all duration-300 ${
                showImgSection ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-stone-200'
              }`}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-sm capitalize">
                  {user?.name?.charAt(0) || '?'}
                </div>
              )}
            </motion.div>

            <div className="text-left block">
              <p className="font-semibold text-stone-800 text-sm sm:text-base leading-tight">{user?.name}</p>
              <p className="text-xs text-stone-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Expandable avatar editor */}
      <AnimatePresence initial={false}>
        {showImgSection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: { height: { duration: 0.3 }, opacity: { duration: 0.2, delay: 0.05 } },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } },
            }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-stone-100/80 w-full">
              <h3 className="text-base font-bold text-stone-800 mb-1">Update Avatar Photo</h3>
              <p className="text-xs text-stone-500 mb-4">
                Upload a custom profile image. Preview scales responsively.
              </p>

              <AvatarPicker
                initialImage={user?.avatar}
                name={user?.name}
                email={user?.email}
                onAvatarSelected={(imgUrl) => setTempAvatar(imgUrl)}
                onSizeChange={(size) => setAvatarSize(size)}
              />

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowImgSection(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:bg-stone-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveAvatarChange}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar