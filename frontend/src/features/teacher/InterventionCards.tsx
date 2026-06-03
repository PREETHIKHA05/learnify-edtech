'use client'

import { useState } from 'react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Zap } from 'lucide-react'
import { MOCK_CLASS_STUDENTS, type ClassStudent } from '@/shared/mocks/students'
import { teacherApi } from '@/services'

export function InterventionCards({ students }: { students?: ClassStudent[] }) {
  const source = students ?? MOCK_CLASS_STUDENTS
  const withInterventions = source.filter((s) => s.interventions.length > 0)
  const [applied, setApplied] = useState<Set<string>>(new Set())

  const handleApply = async (studentId: string, action: string) => {
    const key = `${studentId}-${action}`
    try {
      await teacherApi.applyIntervention(studentId, action)
      setApplied((prev) => new Set(prev).add(key))
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {withInterventions.map((student) =>
        student.interventions.map((action, idx) => (
          <Card key={`${student.id}-${idx}`} className="p-4 bg-card border-border stat-card-secondary">
            <div className="flex items-start gap-3">
              <div className="icon-badge icon-badge-secondary">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{student.name}</p>
                <p className="text-sm font-medium text-foreground">{action}</p>
                <Button
                  size="sm"
                  className="mt-3"
                  disabled={applied.has(`${student.id}-${action}`)}
                  onClick={() => handleApply(student.id, action)}
                >
                  {applied.has(`${student.id}-${action}`) ? 'Applied' : 'Apply Intervention'}
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
