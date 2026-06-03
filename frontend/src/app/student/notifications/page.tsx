'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { AlertCircle, Zap, Trophy, BookOpen, Clock, Trash2, MessageSquare, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'
import { notificationsApi, type AppNotification } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

const typeConfig: Record<string, { icon: LucideIcon; color: string }> = {
  gap: { icon: AlertCircle, color: 'red' },
  streak: { icon: Zap, color: 'yellow' },
  notes: { icon: BookOpen, color: 'purple' },
  achievement: { icon: Trophy, color: 'green' },
  reminder: { icon: Clock, color: 'blue' },
  feedback: { icon: MessageSquare, color: 'blue' },
  xp: { icon: Zap, color: 'green' },
  assignment: { icon: BookOpen, color: 'purple' },
}

function getIconColor(color: string) {
  switch (color) {
    case 'red': return 'text-[var(--accent-danger)]'
    case 'yellow': return 'text-[var(--accent-warn)]'
    case 'blue': return 'text-[var(--accent-primary)]'
    case 'green': return 'text-[var(--accent-secondary)]'
    case 'purple': return 'text-[var(--accent-primary)]'
    default: return 'text-primary'
  }
}

function getBgColor(color: string) {
  switch (color) {
    case 'red': return 'icon-badge-danger'
    case 'yellow': return 'icon-badge-warn'
    case 'blue': return 'icon-badge'
    case 'green': return 'icon-badge-secondary'
    case 'purple': return 'icon-badge'
    default: return 'icon-badge'
  }
}

function getBorderAccent(color: string) {
  switch (color) {
    case 'red': return 'border-l-[var(--accent-danger)]'
    case 'yellow': return 'border-l-[var(--accent-warn)]'
    case 'blue': return 'border-l-[var(--accent-primary)]'
    case 'green': return 'border-l-[var(--accent-secondary)]'
    case 'purple': return 'border-l-[var(--accent-primary)]'
    default: return 'border-l-[var(--accent-primary)]'
  }
}

export default function Notifications() {
  const { user } = useAuth()
  const userId = user?.id ?? DEMO_STUDENT.id
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationsApi
      .list(userId, 'student')
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const unreadCount = notifications.filter((n) => !n.read).length
  const categories = [
    { label: 'All', count: notifications.length },
    { label: 'Unread', count: unreadCount },
    { label: 'Gaps', count: notifications.filter((n) => n.type === 'gap').length },
    { label: 'Achievements', count: notifications.filter((n) => n.type === 'achievement').length },
    { label: 'Reminders', count: notifications.filter((n) => ['streak', 'reminder', 'notes'].includes(n.type)).length },
  ]

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read)
    await Promise.all(unread.map((n) => notificationsApi.markRead(n.id)))
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = async (id: string) => {
    await notificationsApi.markRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <>
      <Header
        title="Notifications"
        subtitle="Urgency-ranked alerts — critical gaps and streak nudges first"
      />

      <main className="p-8 space-y-8">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button key={category.label} variant="outline" size="sm" className="whitespace-nowrap">
              {category.label}
              {category.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                  {category.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="text-foreground">Loading notifications…</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type] ?? typeConfig.reminder
              const Icon = config.icon
              return (
                <Card
                  key={notification.id}
                  onClick={() => !notification.read && markRead(notification.id)}
                  className={`p-4 border-l-[3px] cursor-pointer transition-all hover:border-[var(--border-default)] ${getBorderAccent(config.color)} ${!notification.read ? 'bg-[var(--accent-glow)]' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 icon-badge ${getBgColor(config.color)}`}>
                      <Icon className={`w-5 h-5 ${getIconColor(config.color)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2 align-middle" />
                          )}
                        </h3>
                        <span className="text-xs font-bold px-2 py-0.5 bg-muted rounded font-stat shrink-0">
                          Urgency {notification.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-foreground">{notification.timestamp}</p>
                    </div>
                    <button className="flex-shrink-0 text-foreground hover:text-destructive transition-colors" type="button">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
