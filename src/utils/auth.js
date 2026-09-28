export const AUTH_TOKEN_KEY = 'foodshareToken'
export const AUTH_USER_KEY = 'foodshareCurrentUser'

export function setAuth(user, token) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user || null))
  localStorage.setItem(AUTH_TOKEN_KEY, token || '')
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null')
}

export function clearAuth() {
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}
