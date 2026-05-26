import { create } from 'zustand'

const API_BASE_URL = 'https://dummyjson.com'
const USERS_KEY = 'registered_users'
const SESSION_KEY = 'current_session_user'

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'The API request failed.')
  }

  return data
}

const toAppUser = (apiUser) => {
  const fullName = [apiUser.firstName, apiUser.lastName].filter(Boolean).join(' ')

  return {
    id: apiUser.id,
    name: apiUser.name || fullName || apiUser.username || apiUser.email,
    email: apiUser.email,
    username: apiUser.username,
    avatar: apiUser.avatar || apiUser.image || null,
    image: apiUser.image || apiUser.avatar || null,
    role: apiUser.role,
    accessToken: apiUser.accessToken,
    refreshToken: apiUser.refreshToken,
    provider: apiUser.provider || 'dummyjson',
  }
}

const findDummyUserByEmail = async (email) => {
  const data = await apiRequest(
    `/users/filter?key=email&value=${encodeURIComponent(email)}&select=id,username,email`
  )

  return data.users?.[0] || null
}

const buildSignupPayload = (userData) => {
  const [firstName, ...rest] = userData.name.trim().split(/\s+/)
  const username = userData.email
    .split('@')[0]
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()

  return {
    firstName,
    lastName: rest.join(' '),
    username,
    email: userData.email,
    password: userData.password,
    image: userData.avatar,
  }
}

const initialUsers = readStorage(USERS_KEY, [])
const initialUser = readStorage(SESSION_KEY, null)

const useAuthStore = create((set, get) => ({
  users: initialUsers,
  user: initialUser,
  isLoading: false,
  error: '',

  login: async (identifier, password) => {
    const loginId = identifier.trim()
    set({ isLoading: true, error: '' })

    try {
      let username = loginId

      if (loginId.includes('@')) {
        const remoteUser = await findDummyUserByEmail(loginId)

        if (!remoteUser?.username) {
          throw new Error('No DummyJSON user exists with that email.')
        }

        username = remoteUser.username
      }

      const authUser = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      })

      const currentUser = await apiRequest('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      }).catch(() => authUser)

      const user = toAppUser({
        ...authUser,
        ...currentUser,
        accessToken: authUser.accessToken,
        refreshToken: authUser.refreshToken,
      })

      writeStorage(SESSION_KEY, user)
      set({ user, isLoading: false, error: '' })

      return { success: true, user }
    } catch (error) {
      const { users } = get()
      const localUser = users.find(
        (u) =>
          (u.email === loginId || u.username === loginId) &&
          u.password === password
      )

      if (localUser) {
        writeStorage(SESSION_KEY, localUser)
        set({ user: localUser, isLoading: false, error: '' })
        return { success: true, user: localUser }
      }

      const message = error.message || 'The email/username or password is incorrect.'
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  signup: async (userData) => {
    const { users } = get()
    const email = userData.email.trim()

    if (users.some((u) => u.email === email)) {
      return { success: false, message: 'Email already registered!' }
    }

    set({ isLoading: true, error: '' })

    try {
      const payload = buildSignupPayload({ ...userData, email })
      const createdUser = await apiRequest('/users/add', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const user = {
        ...toAppUser({
          ...createdUser,
          email,
          username: payload.username,
          image: userData.avatar,
          provider: 'dummyjson-created',
        }),
        password: userData.password,
      }

      const updatedUsers = [...users, user]
      writeStorage(USERS_KEY, updatedUsers)
      writeStorage(SESSION_KEY, user)
      set({ users: updatedUsers, user, isLoading: false, error: '' })

      return { success: true, user }
    } catch (error) {
      const message = error.message || 'Could not create this account right now.'
      set({ isLoading: false, error: message })
      return { success: false, message }
    }
  },

  updateProfilePicture: async (avatarDataUrl) => {
    const { user, users } = get()
    if (!user) return

    const updatedUser = {
      ...user,
      avatar: avatarDataUrl,
      image: avatarDataUrl,
    }

    const updatedUsers = users.map((u) =>
      u.email === user.email ? updatedUser : u
    )

    writeStorage(SESSION_KEY, updatedUser)
    writeStorage(USERS_KEY, updatedUsers)
    set({ user: updatedUser, users: updatedUsers, error: '' })

    if (!Number.isFinite(Number(user.id))) return

    try {
      await apiRequest(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ image: avatarDataUrl }),
      })
    } catch (error) {
      set({ error: error.message || 'Profile photo was saved locally only.' })
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY)
    set({ user: null, error: '' })
  },
}))

export default useAuthStore
