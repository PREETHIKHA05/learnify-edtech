'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { AlertCircle, MessageSquare, Zap, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'
import { notificationsApi, type AppNotification } from '@/services'
import { DEMO_TEACHER } from '@/shared/mocks/users'

const iconMap: Record<string, LucideIcon> = {
  gap: AlertCircle,
  cluster: Zap,
  feedback: MessageSquare,
}

export default function TeacherNotificationsPage() {
  const { user } = useAuth()
  const userId = user?.id ?? DEMO_TEACHER.id
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationsApi
      .list(userId, 'teacher')
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <>
      <Header
        title="Notifications"
        subtitle="Urgency-ranked feed — most critical gaps shown first"
      />
      <main className="p-8 space-y-3">
        {loading ? (
          <p className="text-foreground">Loading notifications…</p>
        ) : (
          notifications.map((n) => {
            const Icon = iconMap[n.type] ?? AlertCircle
            return (
              <Card
                key={n.id}
                className={`p-4 border-l-[3px] ${
                  n.urgency >= 80
                    ? 'border-l-[var(--accent-danger)] bg-[color-mix(in_srgb,var(--accent-danger)_10%,transparent)]'
                    : n.urgency >= 60
                      ? 'border-l-[var(--accent-warn)] bg-[color-mix(in_srgb,var(--accent-warn)_10%,transparent)]'
                      : 'border-l-[var(--accent-primary)] bg-[var(--accent-glow)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${n.urgency >= 80 ? 'text-[var(--accent-danger)]' : n.urgency >= 60 ? 'text-[var(--accent-warn)]' : 'text-[var(--accent-primary)]'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{n.title}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 bg-muted rounded font-stat">Urgency {n.urgency}</span>
                      {!n.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-foreground mt-1">{n.timestamp}</p>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </main>
    </>
  )
}
