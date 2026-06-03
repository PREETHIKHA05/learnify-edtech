'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ScatterChart } from '@/widgets/charts/ScatterChart'
import { TopicCard } from '@/shared/ui/common/topic-card'
import { PeerComparisonCard } from '@/features/gap/peer-comparison-card'
import { GapClosureTracker } from '@/features/gap/gap-closure-tracker'
import { GapTrendBadge } from '@/features/gap/gap-trend-badge'
import { AlertCircle, TrendingUp, BookOpen, Clock, FileText } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'
import { gapsApi, type GapReport } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

function severityToStatus(severity: string): 'on-track' | 'needs-review' | 'critical' {
  if (severity === 'red') return 'critical'
  if (severity === 'amber') return 'needs-review'
  return 'on-track'
}

export default function GapDetection() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [report, setReport] = useState<GapReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gapsApi
      .getReport(studentId)
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [studentId])

  if (loading) {
    return (
      <>
        <Header title="Gap Detection" subtitle="Loading your gap report from the API…" />
        <main className="p-8"><p className="text-foreground">Loading…</p></main>
      </>
    )
  }

  if (!report) {
    return (
      <>
        <Header title="Gap Detection" subtitle="Could not load gap report" />
        <main className="p-8"><p className="text-foreground">Backend unavailable. Start the API on port 8000.</p></main>
      </>
    )
  }

  const criticalGaps = report.gaps.filter((g) => g.severity === 'red' || g.severity === 'amber')
  const highConfAcc = report.gaps.filter((g) => g.confidence >= 70 && g.accuracy >= 70).length
  const lowConfAcc = report.gaps.filter((g) => g.confidence < 50 && g.accuracy < 50).length
  const overconfident = report.gaps.filter((g) => g.confidence >= 70 && g.accuracy < 50).length

  return (
    <>
      <Header
        title="Gap Detection"
        subtitle="Per-student report from quiz results, notes engagement, and time-on-topic"
      />

      <main className="p-8 space-y-8">
        {report.summary.criticalCount > 0 && (
          <Card className="p-4 alert-critical">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-[var(--accent-danger)] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[var(--accent-danger)] mb-1">Critical Gaps Detected</h3>
                <p className="text-sm text-foreground">{report.summary.alertMessage}</p>
              </div>
            </div>
          </Card>
        )}

        {report.streakNudge && (
          <Card className="p-4 alert-warn">
            <p className="text-sm text-foreground">{report.streakNudge.message}</p>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="critical">Critical Gaps</TabsTrigger>
            <TabsTrigger value="by-topic">By Topic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-8 bg-card border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Confidence vs Accuracy Analysis</h2>
              <ScatterChart
                data={report.scatterData}
                xLabel="Confidence Level"
                yLabel="Accuracy %"
                title="Your Topics"
              />
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-foreground mb-1">High Confidence & Accuracy</p>
                  <p className="text-2xl font-bold text-foreground font-stat">{highConfAcc} Topics</p>
                </div>
                <div>
                  <p className="text-foreground mb-1">Low Confidence & Accuracy</p>
                  <p className="text-2xl font-bold text-[var(--accent-danger)] font-stat">{lowConfAcc} Topics</p>
                </div>
                <div>
                  <p className="text-foreground mb-1">Overconfident (Gap)</p>
                  <p className="text-2xl font-bold text-[var(--accent-warn)] font-stat">{overconfident} Topics</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PeerComparisonCard items={report.peerComparisons} />
              <GapClosureTracker items={report.closureProgress} />
            </div>

            {report.notesFlags.length > 0 && (
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">AI Notes Feedback</h3>
                {report.notesFlags.map((flag) => (
                  <p key={flag.topic} className="text-sm text-foreground mb-2">{flag.message}</p>
                ))}
              </Card>
            )}
          </TabsContent>

          <TabsContent value="critical" className="space-y-4">
            {criticalGaps.map((gap) => (
              <Card key={gap.topic} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{gap.topic}</h3>
                    <p className="text-sm text-foreground mt-1">{gap.recommendedAction}</p>
                  </div>
                  <GapTrendBadge trend={gap.trend} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-foreground mb-3">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Quiz: {gap.quizScore}%</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Notes: {gap.notesEngagement}%</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time: {gap.timeOnTopicHours}h</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                  <div className="progress-bar-danger h-full rounded-full" style={{ width: `${gap.accuracy}%` }} />
                </div>
                <Button size="sm" variant="destructive">Fill This Gap</Button>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="by-topic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.gaps.map((gap) => (
                <TopicCard
                  key={gap.topic}
                  title={gap.topic}
                  status={severityToStatus(gap.severity)}
                  progress={gap.accuracy}
                  description={`${gap.recommendedAction} · Trend: ${gap.trend}`}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommended Learning Path
          </h3>
          <ol className="space-y-3">
            {report.learningPath.map((step) => (
              <li key={step.step} className="flex gap-3 text-sm">
                <span className="font-bold text-foreground font-stat">{step.step}.</span>
                <span className="text-foreground">
                  <strong>{step.topic}</strong> — {step.action} ({step.hours})
                </span>
              </li>
            ))}
          </ol>
          <Button className="mt-6 w-full">Start Learning Path</Button>
        </Card>
      </main>
    </>
  )
}
