export type UserRole = 'student' | 'teacher'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  className?: string
}

export interface AuthSession {
  user: User
  token: string
}
