'use client'

import { useState } from 'react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Users, BookOpen } from 'lucide-react'
import type { ClassStudent } from '@/shared/mocks/students'
import { MOCK_CLASS_STUDENTS } from '@/shared/mocks/students'
import { teacherApi } from '@/services'

export function BulkActionPanel({ students }: { students?: ClassStudent[] }) {
  const source = students ?? MOCK_CLASS_STUDENTS
  const flagged = source.filter((s) => s.urgencyScore >= 50)
  const [selected, setSelected] = useState<string[]>(flagged.map((s) => s.id))
  const [status, setStatus] = useState<string | null>(null)

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelected(selected.length === flagged.length ? [] : flagged.map((s) => s.id))
  }

  const runBulk = async (action: string) => {
    try {
      const result = await teacherApi.bulkIntervention(selected, action)
      setStatus(`Applied "${action}" to ${result.count} students via API`)
    } catch {
      setStatus('Bulk action failed — is the backend running?')
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Bulk Actions
        </h3>
        <button onClick={toggleAll} className="text-xs text-primary hover:underline">
          {selected.length === flagged.length ? 'Deselect all' : 'Select all flagged'}
        </button>
      </div>

      <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
        {flagged.map((student) => (
          <label key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
            <Checkbox checked={selected.includes(student.id)} onCheckedChange={() => toggle(student.id)} />
            <span className="text-sm text-foreground flex-1">{student.name}</span>
            <span className="text-xs text-foreground font-stat">Urgency {student.urgencyScore}</span>
          </label>
        ))}
      </div>

      {status && <p className="text-sm text-[var(--accent-secondary)] mb-4">{status}</p>}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={selected.length === 0} className="gap-1" onClick={() => runBulk('Assign remedial content')}>
          <BookOpen className="w-3 h-3" />
          Assign remedial content ({selected.length})
        </Button>
        <Button size="sm" variant="outline" disabled={selected.length === 0} onClick={() => runBulk('Send gap alert')}>
          Send gap alert
        </Button>
        <Button size="sm" variant="outline" disabled={selected.length === 0} onClick={() => runBulk('Schedule 1:1s')}>
          Schedule 1:1s
        </Button>
      </div>
    </Card>
  )
}
