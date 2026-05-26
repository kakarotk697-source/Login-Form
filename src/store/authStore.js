import { create } from 'zustand'

const storedUsers = localStorage.getItem('registered_users')
const storedUser  = localStorage.getItem('current_session_user')
const initialUsers = storedUsers ? JSON.parse(storedUsers) : []
const initialUser  = storedUser  ? JSON.parse(storedUser)  : null

const useAuthStore = create((set, get) => ({
  users: initialUsers,
  user:  initialUser,

  login: (email, password) => {
    const { users } = get()
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      localStorage.setItem('current_session_user', JSON.stringify(foundUser))
      set({ user: foundUser })
      return true
    }
    return false
  },

  signup: (userData) => {
    const { users } = get()
    if (users.some((u) => u.email === userData.email)) {
      return { success: false, message: 'Email already registered!' }
    }
    const updatedUsers = [...users, userData]
    localStorage.setItem('registered_users', JSON.stringify(updatedUsers))
    localStorage.setItem('current_session_user', JSON.stringify(userData))
    set({ users: updatedUsers, user: userData })
    return { success: true }
  },

  updateProfilePicture: (avatarDataUrl) => {
    const { user, users } = get()
    if (!user) return
    const updatedUser  = { ...user, avatar: avatarDataUrl }
    const updatedUsers = users.map((u) => (u.email === user.email ? updatedUser : u))
    localStorage.setItem('current_session_user', JSON.stringify(updatedUser))
    localStorage.setItem('registered_users', JSON.stringify(updatedUsers))
    set({ user: updatedUser, users: updatedUsers })
  },

  logout: () => {
    localStorage.removeItem('current_session_user')
    set({ user: null })
  },
}))

export default useAuthStore