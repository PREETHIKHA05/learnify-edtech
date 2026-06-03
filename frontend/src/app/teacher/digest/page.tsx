'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { WeeklyDigestCard } from '@/features/teacher/WeeklyDigestCard'
import { Card } from '@/shared/ui/card'
import { teacherApi, type TeacherDashboard } from '@/services'
import { MOCK_CLASS_STUDENTS } from '@/shared/mocks/students'

export default function TeacherDigestPage() {
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null)

  useEffect(() => {
    teacherApi.getDashboard().then(setDashboard).catch(() => {})
  }, [])

  const students = dashboard?.students ?? MOCK_CLASS_STUDENTS
  const digest = dashboard?.digest
  const atRisk = students.filter((s) => s.urgencyScore >= 70)
  const topCluster = digest?.topCluster ?? 'Fractions & Algebra'

  return (
    <>
      <Header
        title="Weekly Gap Digest"
        subtitle="Email-style summary ready to send to teachers and admins"
      />
      <main className="p-8 space-y-6">
        <WeeklyDigestCard digest={digest} />

        <Card className="p-6 bg-card border-border">
          <p className="text-xs text-foreground mb-4">Preview · Email body</p>
          <div className="space-y-4 text-sm text-foreground border-l-2 border-muted pl-4">
            <p>Hi Dr. Williams,</p>
            <p>Here is your weekly gap summary for <strong>Math 10A</strong> (week of June 3, 2026):</p>
            <p><strong>{atRisk.length} students</strong> are currently at-risk and need intervention this week.</p>
            <ul className="list-disc pl-5 space-y-1">
              {atRisk.map((s) => (
                <li key={s.id}>{s.name} — urgency {s.urgencyScore}, {s.topicsNeedingAttention} topic gaps</li>
              ))}
            </ul>
            <p>Top simultaneous weakness: <strong>{topCluster}</strong> — consider a class-wide remedial session.</p>
            <p>— Learnify Gap Detection Engine</p>
          </div>
        </Card>
      </main>
    </>
  )
}
