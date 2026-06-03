'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { TopicCard } from '@/shared/ui/common/topic-card'
import { XPBar } from '@/shared/ui/common/xp-bar'
import { MasteryMeter } from '@/shared/ui/common/mastery-meter'
import { HeatmapChart } from '@/widgets/charts/HeatmapChart'
import { Zap, BookOpen, Clock, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/features/auth/auth-context'
import { studentsApi, type StudentDashboard } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

export default function Dashboard() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null)

  useEffect(() => {
    studentsApi.getDashboard(studentId).then(setDashboard).catch(() => {})
  }, [studentId])

  const displayTopics = dashboard?.topics?.length ? dashboard.topics : [
    { title: 'Loading…', description: 'Fetching from API', status: 'needs-review' as const, progress: 0, xp: 0 },
  ]
  const heatmap = dashboard?.heatmap ?? []

  return (    <>
                <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your learning progress at a glance."
        />

        <main className="p-8 space-y-8">
          {/* Personal Gap Alert */}
          <Card className="p-5 alert-warn">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="icon-badge icon-badge-warn">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {dashboard?.alertMessage ?? 'Loading gap alert…'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Linear Algebra, Probability, and Trigonometry gaps detected from quiz results and notes engagement.
                  </p>
                </div>
              </div>
              <Link href="/student/gap-detection">
                <Button size="sm" className="gap-1 flex-shrink-0">
                  View gaps
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card border-border stat-card-warn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{dashboard?.streak ?? '—'} Days</p>
                </div>
                <div className="icon-badge icon-badge-warn">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{(dashboard?.xp ?? 0).toLocaleString()}</p>
                </div>
                <div className="icon-badge">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border stat-card-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Topics Mastered</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{dashboard?.stats?.topicsOnTrack ?? 0}/{dashboard ? dashboard.stats.topicsOnTrack + dashboard.stats.topicsNeedReview + dashboard.stats.topicsCritical : '—'}</p>
                </div>
                <div className="icon-badge icon-badge-secondary">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Study Time</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{dashboard?.stats?.studyHoursWeek ?? '—'}h</p>
                </div>
                <div className="icon-badge">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* XP Bar */}
          <Card className="p-6 bg-card border-border">
            <XPBar current={dashboard?.xp ?? 0} max={10000} level={dashboard?.level ?? 1} />
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topics Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Your Topics</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="space-y-3">
                {displayTopics.map((topic, idx) => (
                  <TopicCard
                    key={`${topic.title}-${idx}`}
                    title={topic.title}
                    description={topic.description}
                    status={topic.status}
                    progress={topic.progress}
                    xp={topic.xp}
                  />
                ))}
              </div>
            </div>

            {/* Overall Mastery */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">Overall Mastery</h2>
              <Card className="p-6 bg-card border-border flex justify-center">
                <MasteryMeter score={dashboard?.masteryPercent ?? 0} label="Overall" size="lg" />
              </Card>
              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-3">Next Level</p>
                <p className="text-2xl font-bold text-foreground mb-4 font-stat">Level {dashboard?.level ?? 1}</p>
                <Button className="w-full">
                  View Path
                </Button>
              </Card>
            </div>
          </div>

          {/* Activity Heatmap */}
          <Card className="p-8 bg-card border-border">
            <HeatmapChart data={heatmap.length ? heatmap : [{ week: 0, day: 'Mon', count: 0 }]} />
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="py-6">
              Start Tutor
            </Button>
            <Button variant="secondary" className="py-6">
              Review Weak Areas
            </Button>
            <Button variant="outline" className="py-6 border-[var(--border-default)]">
              Create Study Plan
            </Button>
          </div>
        </main>
    </>
  )
}
