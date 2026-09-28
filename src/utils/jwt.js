const SECRET_KEY = 'foodshare-secret-2026'

function base64UrlEncode(value) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const decoded = atob(base64)
  return decodeURIComponent(
    decoded.split('').map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join('')
  )
}

function signMessage(message) {
  return base64UrlEncode(`${message}.${SECRET_KEY}`)
}

export function createJWT(payload, expiresInSeconds = 60 * 60 * 4) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const signedPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(signedPayload))
  const signature = signMessage(`${encodedHeader}.${encodedPayload}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyJWT(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  const [header, payload, signature] = parts
  const expectedSignature = signMessage(`${header}.${payload}`)
  if (signature !== expectedSignature) {
    return null
  }

  try {
    const parsedPayload = JSON.parse(base64UrlDecode(payload))
    if (typeof parsedPayload.exp !== 'number') {
      return null
    }
    if (Math.floor(Date.now() / 1000) >= parsedPayload.exp) {
      return null
    }
    return parsedPayload
  } catch {
    return null
  }
}

export function getStoredTokenUser() {
  const token = localStorage.getItem('foodshareToken')
  return verifyJWT(token)
}
