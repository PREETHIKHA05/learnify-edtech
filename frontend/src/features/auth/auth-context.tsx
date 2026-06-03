'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { AuthSession, User, UserRole } from '@/shared/types/auth'
import { DEMO_STUDENT, DEMO_TEACHER } from '@/shared/mocks/users'
import { authApi } from '@/services'

const STORAGE_KEY = 'learnify_demo_session'

function readStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return (JSON.parse(stored) as AuthSession).user
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  loginAsDemo: (role: UserRole) => User
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function createSession(user: User): AuthSession {
  return { user, token: `demo-token-${user.id}` }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(readStoredUser())
    setIsLoading(false)
  }, [])

  const loginAsDemo = useCallback((role: UserRole) => {
    const fallback = role === 'teacher' ? DEMO_TEACHER : DEMO_STUDENT
    authApi.demoLogin(role).then((res) => {
      const session: AuthSession = { user: res.user as User, token: res.token }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      setUser(res.user as User)
    }).catch(() => {
      const session = createSession(fallback)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      setUser(fallback)
    })
    return fallback
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, loginAsDemo, logout }),
    [user, isLoading, loginAsDemo, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/** Resolves user from React state or localStorage (avoids login race on navigation). */
export function useEffectiveUser(): { user: User | null; isLoading: boolean } {
  const { user, isLoading } = useAuth()
  const stored = typeof window !== 'undefined' ? readStoredUser() : null
  return { user: user ?? stored, isLoading }
}

export function useRequireAuth(requiredRole?: UserRole) {
  const { user: stateUser, isLoading } = useAuth()
  const router = useRouter()
  const user = stateUser ?? readStoredUser()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === 'teacher' ? '/teacher' : '/student')
    }
  }, [user, isLoading, requiredRole, router])

  return { user, isLoading }
}

export function getPortalPath(role: UserRole): string {
  return role === 'teacher' ? '/teacher' : '/student'
}
