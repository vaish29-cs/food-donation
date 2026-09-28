import { getAuthToken } from '../utils/auth'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || 'API request failed')
  }

  return response.json().catch(() => null)
}

export async function registerUser(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export async function sendContactMessage(messageData) {
  return request('/contact-messages', {
    method: 'POST',
    body: JSON.stringify(messageData)
  })
}

export async function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function registerAdmin(adminData) {
  return request('/auth/admin-register', {
    method: 'POST',
    body: JSON.stringify(adminData)
  })
}

export async function createDonation(donationData) {
  return request('/donations', {
    method: 'POST',
    body: JSON.stringify(donationData)
  })
}

export async function getDonationRequests(view) {
  const query = view ? `?view=${view}` : ''
  return request(`/requests${query}`)
}

export async function getAvailableFood() {
  return request('/donations')
}

export async function getMyDonations() {
  return request('/donations/mine')
}

export async function createFoodRequest(requestData) {
  return request('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
}

export async function updateRequestStatus(requestId, status) {
  return request(`/requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function getUsers() {
  return request('/admin/users')
}

export async function getContactMessages() {
  return request('/admin/messages')
}

export async function getUserDetails(userId) {
  return request(`/admin/users/${userId}`)
}

export async function updateUserType(userId, userType) {
  return request(`/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ userType })
  })
}

export async function deleteUser(userId) {
  return request(`/admin/users/${userId}`, {
    method: 'DELETE'
  })
}

export async function removeUser(userId) {
  return request(`/admin/users/${userId}/remove`, { method: 'PATCH' })
}
