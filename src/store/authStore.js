import { create } from 'zustand'
import { STORAGE_KEYS } from '../constants/index'
import { readStorage, writeStorage, removeStorage } from '../utils/storage'
import { toAppUser, buildSignupPayload } from '../utils/authUtils'
import {
  fetchUserByEmail,
  loginWithCredentials,
  fetchCurrentUser,
  createUser,
  updateUserImage,
} from '../api/authApi'

/**
 * @typedef {object} AppUser
 * @property {number|string} id
 * @property {string}  name
 * @property {string}  email
 * @property {string}  username
 * @property {string|null} avatar
 * @property {string|null} image
 * @property {string}  [role]
 * @property {string}  [accessToken]
 * @property {string}  [refreshToken]
 * @property {string}  provider
 */

const initialUsers = readStorage(STORAGE_KEYS.USERS, [])
const initialUser  = readStorage(STORAGE_KEYS.SESSION, null)

const useAuthStore = create((set, get) => ({
  users:     initialUsers,
  user:      initialUser,
  isLoading: false,
  error:     '',

  // ─── Login ─────────────────────────────────────────────────────────────────
  login: async (identifier, password) => {
    const loginId = identifier.trim()
    set({ isLoading: true, error: '' })

    try {
      // If the identifier looks like an email, resolve it to a username first
      let username = loginId
      if (loginId.includes('@')) {
        const remoteUser = await fetchUserByEmail(loginId)
        if (!remoteUser?.username) throw new Error('No user found with that email.')
        username = remoteUser.username
      }

      const authData = await loginWithCredentials(username, password)

      // Enrich with full profile (best-effort)
      const profileData = await fetchCurrentUser(authData.accessToken).catch(() => authData)

      const user = toAppUser({
        ...authData,
        ...profileData,
        accessToken:  authData.accessToken,
        refreshToken: authData.refreshToken,
      })

      writeStorage(STORAGE_KEYS.SESSION, user)
      set({ user, isLoading: false, error: '' })
      return { success: true, user }
    } catch (error) {
      // Fall back to locally-registered users
      const { users } = get()
      const localUser = users.find(
        (u) =>
          (u.email === loginId || u.username === loginId) &&
          u.password === password
      )

      if (localUser) {
        writeStorage(STORAGE_KEYS.SESSION, localUser)
        set({ user: localUser, isLoading: false, error: '' })
        return { success: true, user: localUser }
      }

      const message = error.message || 'Incorrect email/username or password.'
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  // ─── Signup ────────────────────────────────────────────────────────────────
  signup: async (userData) => {
    const { users } = get()
    const email = userData.email.trim()

    if (users.some((u) => u.email === email)) {
      return { success: false, message: 'Email already registered.' }
    }

    set({ isLoading: true, error: '' })

    try {
      const payload     = buildSignupPayload({ ...userData, email })
      const createdData = await createUser(payload)

      const user = {
        ...toAppUser({
          ...createdData,
          email,
          username: payload.username,
          image:    userData.avatar,
          provider: 'dummyjson-created',
        }),
        password: userData.password, // kept only for local fallback login
      }

      const updatedUsers = [...users, user]
      writeStorage(STORAGE_KEYS.USERS,   updatedUsers)
      writeStorage(STORAGE_KEYS.SESSION, user)
      set({ users: updatedUsers, user, isLoading: false, error: '' })
      return { success: true, user }
    } catch (error) {
      const message = error.message || 'Could not create account right now.'
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  // ─── Update profile picture ────────────────────────────────────────────────
  updateProfilePicture: async (avatarDataUrl) => {
    const { user, users } = get()
    if (!user) return

    const updatedUser  = { ...user, avatar: avatarDataUrl, image: avatarDataUrl }
    const updatedUsers = users.map((u) => (u.email === user.email ? updatedUser : u))

    writeStorage(STORAGE_KEYS.SESSION, updatedUser)
    writeStorage(STORAGE_KEYS.USERS,   updatedUsers)
    set({ user: updatedUser, users: updatedUsers, error: '' })

    // Best-effort remote sync
    if (Number.isFinite(Number(user.id))) {
      try {
        await updateUserImage(user.id, avatarDataUrl)
      } catch (error) {
        set({ error: error.message || 'Profile photo saved locally only.' })
      }
    }
  },

  // ─── Logout ────────────────────────────────────────────────────────────────
  logout: () => {
    removeStorage(STORAGE_KEYS.SESSION)
    set({ user: null, error: '' })
  },
}))

export default useAuthStore