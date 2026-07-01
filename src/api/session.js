const SESSION_KEY = 'ecomus.userId'

function isObjectIdLike(value) {
  return typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value)
}

function createAnonymousUserId() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function getUserId() {
  if (typeof window === 'undefined') {
    const envUserId = import.meta.env.VITE_ECOMUS_USER_ID?.trim()
    return isObjectIdLike(envUserId) ? envUserId : createAnonymousUserId()
  }

  const storedUserId = window.localStorage.getItem(SESSION_KEY)
  if (isObjectIdLike(storedUserId)) {
    return storedUserId
  }

  const envUserId = import.meta.env.VITE_ECOMUS_USER_ID?.trim()
  const seededUserId = isObjectIdLike(envUserId) ? envUserId : createAnonymousUserId()

  window.localStorage.setItem(SESSION_KEY, seededUserId)
  return seededUserId
}

export function setUserId(userId) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SESSION_KEY, userId)
}
