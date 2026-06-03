'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { ClassGapHeatmap } from '@/features/teacher/ClassGapHeatmap'
import { AtRiskStudentsList } from '@/features/teacher/AtRiskStudentsList'
import { TopicWeaknessClusters } from '@/features/teacher/TopicWeaknessClusters'
import { WeeklyDigestCard } from '@/features/teacher/WeeklyDigestCard'
import { BulkActionPanel } from '@/features/teacher/BulkActionPanel'
import { teacherApi, type TeacherDashboard } from '@/services'
import { Users, AlertTriangle, TrendingDown, BookOpen } from 'lucide-react'

export default function TeacherDashboard() {
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    teacherApi
      .getDashboard()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <Header title="Gap Dashboard" subtitle="Loading class data from API…" />
        <main className="p-8"><p className="text-foreground">Loading…</p></main>
      </>
    )
  }

  if (!dashboard) {
    return (
      <>
        <Header title="Gap Dashboard" subtitle="Could not load dashboard" />
        <main className="p-8"><p className="text-foreground">Start backend on port 8000 and refresh.</p></main>
      </>
    )
  }

  return (
    <>
      <Header
        title="Gap Dashboard"
        subtitle="Math 10A — Monitor class-wide learning gaps and intervene early"
      />

      <main className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold text-foreground font-stat">{dashboard.totalStudents}</p>
              </div>
              <div className="icon-badge"><Users className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border stat-card-danger">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground mb-1">At-Risk Students</p>
                <p className="text-3xl font-bold text-[var(--accent-danger)] font-stat">{dashboard.atRiskCount}</p>
              </div>
              <div className="icon-badge icon-badge-danger"><AlertTriangle className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border stat-card-warn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground mb-1">Avg. Gap Score</p>
                <p className="text-3xl font-bold text-foreground font-stat">{dashboard.avgGapScore}</p>
              </div>
              <div className="icon-badge icon-badge-warn"><TrendingDown className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border stat-card-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground mb-1">Pending Interventions</p>
                <p className="text-3xl font-bold text-foreground font-stat">{dashboard.pendingInterventions}</p>
              </div>
              <div className="icon-badge icon-badge-secondary"><BookOpen className="w-5 h-5" /></div>
            </div>
          </Card>
        </div>

        <WeeklyDigestCard digest={dashboard.digest} />
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Class Gap Heatmap</h3>
          <p className="text-sm text-foreground mb-4">Students × topics, colored by gap severity</p>
          <ClassGapHeatmap heatmap={dashboard.heatmap} />
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">At-Risk Students</h3>
            <AtRiskStudentsList students={dashboard.students} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Topic Weakness Clusters</h3>
            <TopicWeaknessClusters clusters={dashboard.clusters} />
          </div>
        </div>
        <BulkActionPanel students={dashboard.students} />
      </main>
    </>
  )
}
