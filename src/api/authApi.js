
import { apiRequest } from './client'


export const fetchUserByEmail = async (email) => {
  const data = await apiRequest(
    `/users/filter?key=email&value=${encodeURIComponent(email)}&select=id,username,email`
  )
  return data.users?.[0] || null
}


export const loginWithCredentials = async (username, password, expiresInMins = 30) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, expiresInMins }),
  })


export const fetchCurrentUser = async (accessToken) =>
  apiRequest('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })


export const createUser = async (payload) =>
  apiRequest('/users/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })


export const updateUserImage = async (userId, imageDataUrl) =>
  apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ image: imageDataUrl }),
  })