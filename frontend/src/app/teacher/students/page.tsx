'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { studentsApi } from '@/services'
import type { ClassStudent } from '@/shared/mocks/students'
import { MOCK_CLASS_STUDENTS } from '@/shared/mocks/students'
import { ChevronRight, AlertTriangle } from 'lucide-react'

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<ClassStudent[]>(MOCK_CLASS_STUDENTS)

  useEffect(() => {
    studentsApi.getAll().then(setStudents).catch(() => {})
  }, [])

  const sorted = [...students].sort((a, b) => b.urgencyScore - a.urgencyScore)

  return (
    <>
      <Header
        title="All Students"
        subtitle="View individual gap reports and learning data for each student"
      />

      <main className="p-8 space-y-4">
        {sorted.map((student) => (
          <Card key={student.id} className="p-5 bg-card border-border hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{student.name}</h3>
                  {student.urgencyScore >= 70 && (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <p className="text-sm text-foreground">{student.email}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-foreground">
                  <span>Gap score: {student.overallGapScore}</span>
                  <span>Urgency: {student.urgencyScore}</span>
                  <span>{student.topicsNeedingAttention} topics need attention</span>
                  <span>Streak: {student.streak} days</span>
                  <span>Last active: {student.lastActive}</span>
                </div>
              </div>
              <Link href={`/teacher/students/${student.id}`}>
                <Button variant="outline" className="gap-2">
                  View Report
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </main>
    </>
  )
}
