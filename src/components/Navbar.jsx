import { useState } from 'react'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AvatarPicker from './AvatarPicker'

function Navbar() {
  const { logout, updateProfilePicture } = useAuthStore()
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [showImgModal, setShowImgModal] = useState(false)
  const [tempAvatar, setTempAvatar] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const saveAvatarChange = () => {
    if (tempAvatar) {
      updateProfilePicture(tempAvatar)
    }
    setShowImgModal(false)
  }

  return (  
    <div className="bg-white/80 backdrop-blur-md border border-stone-100 shadow-sm px-6 py-4 flex justify-between items-center rounded-2xl mb-8">
      {/* Brand Section */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
          ✓
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent hidden sm:block">
          ToDo
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowImgModal(true)}
            className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer flex-shrink-0"
            title="Click to edit avatar"
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

      <AnimatePresence>
        {showImgModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-stone-100"
            >
              <h3 className="text-lg font-bold text-stone-800 mb-2">Update Avatar Photo</h3>
              <p className="text-xs text-stone-500 mb-4">Upload a custom profile layout image. Previews show responsively scaling weights.</p>
              
              <AvatarPicker 
                initialImage={user?.avatar} 
                name={user?.name}
                email={user?.email}
                onAvatarSelected={(imgUrl) => setTempAvatar(imgUrl)} 
              />

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setShowImgModal(false)}
                  className="px-4 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveAvatarChange}
                  className="px-4 py-2 text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar