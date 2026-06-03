'use client'

import Link from 'next/link'
import { AlertTriangle, ChevronRight, MessageSquare, BookOpen } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import type { ClassStudent } from '@/shared/mocks/students'
import { MOCK_CLASS_STUDENTS } from '@/shared/mocks/students'

export function AtRiskStudentsList({ students }: { students?: ClassStudent[] }) {
  const source = students ?? MOCK_CLASS_STUDENTS
  const atRisk = [...source]
    .filter((s) => s.urgencyScore >= 50)
    .sort((a, b) => b.urgencyScore - a.urgencyScore)

  return (
    <div className="space-y-3">
      {atRisk.map((student) => (
        <Card key={student.id} className="p-4 bg-card border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${student.urgencyScore >= 80 ? 'text-destructive' : 'text-foreground'}`} />
                <Link href={`/teacher/students/${student.id}`} className="font-semibold text-foreground hover:text-primary">
                  {student.name}
                </Link>
                <span className={`text-xs font-bold px-2 py-0.5 rounded font-stat ${student.urgencyScore >= 80 ? 'badge-critical' : 'badge-needs-review'}`}>
                  Urgency {student.urgencyScore}
                </span>
              </div>
              <p className="text-sm text-foreground">
                {student.topicsNeedingAttention} topics need attention · Last active {student.lastActive}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link href={`/teacher/students/${student.id}`}>
                <Button size="sm" variant="outline" className="gap-1">
                  <BookOpen className="w-3 h-3" />
                  Assign
                </Button>
              </Link>
              <Link href={`/teacher/students/${student.id}`}>
                <Button size="sm" variant="outline" className="gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Message
                </Button>
              </Link>
              <Link href={`/teacher/students/${student.id}`}>
                <Button size="sm" variant="ghost">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
