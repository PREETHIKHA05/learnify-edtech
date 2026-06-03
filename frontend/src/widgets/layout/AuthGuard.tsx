'use client'

import type { ReactNode } from 'react'
import type { UserRole } from '@/shared/types/auth'
import { useEffectiveUser, useRequireAuth } from '@/features/auth/auth-context'

interface AuthGuardProps {
  role: UserRole
  children: ReactNode
}

export function AuthGuard({ role, children }: AuthGuardProps) {
  useRequireAuth(role)
  const { user, isLoading } = useEffectiveUser()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Redirecting...</div>
      </div>
    )
  }

  return <>{children}</>
}
