'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Zap, Trophy, BookOpen, Clock, Trash2 } from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'gap',
    title: 'Critical Gap Detected',
    message: 'We found a critical gap in Linear Algebra that\'s blocking your progress in Applied Math.',
    timestamp: '2 minutes ago',
    icon: AlertCircle,
    color: 'red',
    read: false,
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Milestone Reached!',
    message: 'You\'ve completed 50 study sessions! You\'ve earned the "Consistent Learner" badge.',
    timestamp: '1 hour ago',
    icon: Trophy,
    color: 'yellow',
    read: false,
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Time to Review',
    message: 'You haven\'t reviewed Derivatives in 3 days. Time to refresh your memory?',
    timestamp: '3 hours ago',
    icon: Clock,
    color: 'blue',
    read: true,
  },
  {
    id: 4,
    type: 'xp',
    title: 'Level Up!',
    message: 'Great work! You\'ve advanced to Level 6. Unlock new topics now.',
    timestamp: '5 hours ago',
    icon: Zap,
    color: 'green',
    read: true,
  },
  {
    id: 5,
    type: 'assignment',
    title: 'New Assignment Available',
    message: 'Your tutor assigned you "Integration Techniques" to master this week.',
    timestamp: '1 day ago',
    icon: BookOpen,
    color: 'purple',
    read: true,
  },
  {
    id: 6,
    type: 'streak',
    title: 'Keep Your Streak!',
    message: 'You have 12 days of study streak. Don\'t miss today\'s session!',
    timestamp: '2 days ago',
    icon: Zap,
    color: 'yellow',
    read: true,
  },
]

const categories = [
  { label: 'All', count: notifications.length },
  { label: 'Unread', count: notifications.filter(n => !n.read).length },
  { label: 'Gaps', count: 1 },
  { label: 'Achievements', count: 2 },
  { label: 'Reminders', count: 2 },
]

export default function Notifications() {
  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-500'
      case 'yellow': return 'text-yellow-500'
      case 'blue': return 'text-blue-500'
      case 'green': return 'text-green-500'
      case 'purple': return 'text-purple-500'
      default: return 'text-primary'
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500/10'
      case 'yellow': return 'bg-yellow-500/10'
      case 'blue': return 'bg-blue-500/10'
      case 'green': return 'bg-green-500/10'
      case 'purple': return 'bg-purple-500/10'
      default: return 'bg-muted'
    }
  }

  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Notifications"
          subtitle="Stay updated on your progress and learning milestones"
        />

        <main className="p-8 space-y-8">
          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
            <Button variant="outline" size="sm">
              Clear all
            </Button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.label}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                {category.label}
                {category.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                    {category.count}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card
                  key={notification.id}
                  className={`p-4 border-l-4 cursor-pointer transition-all hover:border-primary ${
                    notification.read
                      ? `${getBgColor(notification.color)} border-${notification.color}-500/50`
                      : `${getBgColor(notification.color)} border-${notification.color}-500 bg-opacity-20`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 ${getIconColor(notification.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2 align-middle" />
                          )}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>

                    <button className="flex-shrink-0 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Notification Preferences */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: 'Gap Alerts', description: 'Get notified when critical knowledge gaps are detected' },
                { label: 'Study Reminders', description: 'Reminders to continue your learning streak' },
                { label: 'Achievements', description: 'Celebrate milestones and level ups' },
                { label: 'Assignment Updates', description: 'New assignments and deadlines' },
                { label: 'Performance Insights', description: 'Weekly performance summaries' },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-primary"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Notification Channels */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Notification Channels</h3>
            <div className="space-y-4">
              {[
                { channel: 'In-App', description: 'Notifications within Learnify' },
                { channel: 'Email', description: 'Weekly digest emails' },
                { channel: 'Push', description: 'Mobile push notifications' },
              ].map((item) => (
                <div key={item.channel} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.channel}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={item.channel === 'In-App'}
                    className="w-5 h-5 rounded border-primary"
                  />
                </div>
              ))}
            </div>
          </Card>
        </main>
      </PageLayout>
    </>
  )
}
