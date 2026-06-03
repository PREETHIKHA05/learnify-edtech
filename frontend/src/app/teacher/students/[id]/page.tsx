'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { ScatterChart } from '@/widgets/charts/ScatterChart'
import { getStudentById, type ClassStudent } from '@/shared/mocks/students'
import { studentsApi, feedbackApi, type TeacherFeedback } from '@/services'
import { useAuth } from '@/features/auth/auth-context'
import { DEMO_TEACHER } from '@/shared/mocks/users'
import { ArrowLeft, Mic, Send, TrendingDown, TrendingUp, Minus, CheckCircle2 } from 'lucide-react'

const trendConfig = {
  improving: { icon: TrendingUp, label: 'Improving', color: 'text-foreground' },
  stagnant: { icon: Minus, label: 'Stagnant', color: 'text-foreground' },
  widening: { icon: TrendingDown, label: 'Widening', color: 'text-destructive' },
}

const severityBadge = {
  green: 'bg-muted text-foreground',
  amber: 'bg-muted text-foreground',
  red: 'bg-muted text-destructive',
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user } = useAuth()
  const teacher = user ?? DEMO_TEACHER
  const [student, setStudent] = useState<ClassStudent | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedbackText, setFeedbackText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [pastFeedback, setPastFeedback] = useState<TeacherFeedback[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      studentsApi.getById(id),
      feedbackApi.list(id),
    ])
      .then(([s, fb]) => {
        setStudent(s)
        setPastFeedback(fb)
      })
      .catch(() => {
        const fallback = getStudentById(id)
        if (fallback) setStudent(fallback)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSendFeedback = async () => {
    if (!feedbackText.trim() || !student) return
    setSending(true)
    try {
      const entry = await feedbackApi.send({
        studentId: student.id,
        teacherId: teacher.id,
        teacherName: teacher.name,
        message: feedbackText.trim(),
        type: 'text',
      })
      setPastFeedback((prev) => [entry, ...prev])
      setFeedbackText('')
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch {
      // keep form state for retry
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Loading…" subtitle="" />
        <main className="p-8"><p className="text-foreground">Loading student report…</p></main>
      </>
    )
  }

  if (!student) {
    return (
      <>
        <Header title="Student Not Found" subtitle="" />
        <main className="p-8">
          <Link href="/teacher/students">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to students
            </Button>
          </Link>
        </main>
      </>
    )
  }

  const scatterData = student.gaps.map((g) => ({
    x: g.confidence,
    y: g.accuracy,
    name: g.topic,
  }))

  return (
    <>
      <Header
        title={student.name}
        subtitle={`Gap report · ${student.email} · Last active ${student.lastActive}`}
      />

      <main className="p-8 space-y-8">
        <Link href="/teacher/students">
          <Button variant="outline" size="sm" className="gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to all students
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border">
            <p className="text-sm text-foreground">Overall Gap Score</p>
            <p className="text-3xl font-bold text-foreground">{student.overallGapScore}</p>
          </Card>
          <Card className="p-5 bg-card border-border">
            <p className="text-sm text-foreground">Urgency Score</p>
            <p className="text-3xl font-bold text-destructive">{student.urgencyScore}</p>
          </Card>
          <Card className="p-5 bg-card border-border">
            <p className="text-sm text-foreground">Topics Needing Attention</p>
            <p className="text-3xl font-bold text-foreground">{student.topicsNeedingAttention}</p>
          </Card>
          <Card className="p-5 bg-card border-border">
            <p className="text-sm text-foreground">Study Streak</p>
            <p className="text-3xl font-bold text-foreground">{student.streak} days</p>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Confidence vs Accuracy</h3>
          <ScatterChart data={scatterData} xLabel="Confidence" yLabel="Accuracy %" />
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Topic Gap Breakdown</h3>
          <div className="space-y-3">
            {student.gaps.map((gap) => {
              const TrendIcon = trendConfig[gap.trend].icon
              return (
                <Card key={gap.topic} className="p-4 bg-card border-border">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{gap.topic}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${severityBadge[gap.severity]}`}>
                          {gap.severity}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${trendConfig[gap.trend].color}`}>
                          <TrendIcon className="w-3 h-3" />
                          {trendConfig[gap.trend].label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{gap.recommendedAction}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-foreground">Quiz score</p>
                      <p className="font-bold text-foreground">{gap.quizScore}%</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-foreground">Notes engagement</p>
                      <p className="font-bold text-foreground">{gap.notesEngagement}%</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-foreground">Time on topic</p>
                      <p className="font-bold text-foreground">{gap.timeOnTopicHours}h</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-foreground">Confidence / Accuracy</p>
                      <p className="font-bold text-foreground">{gap.confidence}% / {gap.accuracy}%</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Leave Feedback on Gap Card</h3>
          <Textarea
            placeholder="Add a text annotation for this student..."
            className="mb-3"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <Button className="gap-2" onClick={handleSendFeedback} disabled={sending || !feedbackText.trim()}>
              <Send className="w-4 h-4" />
              {sending ? 'Sending…' : 'Send Text Feedback'}
            </Button>
            <Button variant="outline" className="gap-2" disabled>
              <Mic className="w-4 h-4" />
              Record Voice Note
            </Button>
            {sent && (
              <span className="text-sm text-[var(--accent-secondary)] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Feedback sent — student notified
              </span>
            )}
          </div>
          {pastFeedback.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <p className="text-sm font-medium text-foreground">Previous feedback</p>
              {pastFeedback.slice(0, 3).map((fb) => (
                <div key={fb.id} className="text-sm p-3 bg-muted rounded">
                  <p className="text-foreground">{fb.message}</p>
                  <p className="text-xs text-foreground mt-1">{fb.teacherName} · {new Date(fb.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </>
  )
}
