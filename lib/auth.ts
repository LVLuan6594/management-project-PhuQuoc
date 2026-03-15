// Authentication utilities

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin@123"
const AUTH_TOKEN_KEY = "management_auth_token"

export interface AuthUser {
  username: string
  role: "admin"
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

// Validate login credentials
export const validateLogin = (username: string, password: string): AuthResponse => {
  if (!username || !password) {
    return {
      success: false,
      error: "Vui lòng nhập tên đăng nhập và mật khẩu",
    }
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const user: AuthUser = {
      username: ADMIN_USERNAME,
      role: "admin",
    }
    return {
      success: true,
      user,
    }
  }

  return {
    success: false,
    error: "Tên đăng nhập hoặc mật khẩu không chính xác",
  }
}

// Save auth token to localStorage
export const setAuthToken = (user: AuthUser) => {
  if (typeof window !== "undefined") {
    const token = btoa(JSON.stringify(user))
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

// Get auth token from localStorage
export const getAuthToken = (): AuthUser | null => {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) return null

  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

// Clear auth token on logout
export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}
