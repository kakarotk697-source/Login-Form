
export const toAppUser = (apiUser) => {
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


export const buildSignupPayload = (userData) => {
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