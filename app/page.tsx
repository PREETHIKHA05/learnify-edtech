'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TopicCard } from '@/components/TopicCard'
import { XPBar } from '@/components/XPBar'
import { MasteryMeter } from '@/components/MasteryMeter'
import { HeatmapChart } from '@/components/HeatmapChart'
import { Zap, BookOpen, Clock, TrendingUp } from 'lucide-react'

const mockTopics = [
  {
    id: 1,
    title: 'Calculus Fundamentals',
    description: 'Derivatives and integrals',
    status: 'on-track' as const,
    progress: 75,
    xp: 240,
  },
  {
    id: 2,
    title: 'Linear Algebra',
    description: 'Matrices and vectors',
    status: 'needs-review' as const,
    progress: 45,
    xp: 180,
  },
  {
    id: 3,
    title: 'Probability Theory',
    description: 'Distributions and statistics',
    status: 'critical' as const,
    progress: 20,
    xp: 0,
  },
  {
    id: 4,
    title: 'Differential Equations',
    description: 'ODEs and PDEs',
    status: 'on-track' as const,
    progress: 60,
    xp: 200,
  },
]

const mockHeatmap = Array.from({ length: 12 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
    count: (week * 7 + day) % 5,
  }))
).flat()

export default function Dashboard() {
  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your learning progress at a glance."
        />

        <main className="p-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold text-foreground">12 Days</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                  <p className="text-3xl font-bold text-foreground">2,450</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Topics Mastered</p>
                  <p className="text-3xl font-bold text-foreground">8/24</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Study Time</p>
                  <p className="text-3xl font-bold text-foreground">24h 30m</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* XP Bar */}
          <Card className="p-6 bg-card border-border">
            <XPBar current={2450} max={5000} level={5} />
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
                {mockTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
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
                <MasteryMeter score={68} label="Overall" size="lg" />
              </Card>
              <Card className="p-4 bg-card border-border">
                <p className="text-sm text-muted-foreground mb-3">Next Level</p>
                <p className="text-2xl font-bold text-foreground mb-4">Level 6</p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500">
                  View Path
                </Button>
              </Card>
            </div>
          </div>

          {/* Activity Heatmap */}
          <Card className="p-8 bg-card border-border">
            <HeatmapChart data={mockHeatmap} />
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              Start AI Tutor
            </Button>
            <Button className="py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Review Weak Areas
            </Button>
            <Button className="py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Create Study Plan
            </Button>
          </div>
        </main>
      </PageLayout>
    </>
  )
}
