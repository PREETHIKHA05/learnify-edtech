'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { CLASS_TOPICS, getClassGapMatrix, type GapSeverity } from '@/shared/mocks/students'
import { cn } from '@/shared/lib/utils'

const severityColors: Record<GapSeverity, string> = {
  green: 'gap-green',
  amber: 'gap-amber',
  red: 'gap-red',
}

const severityLabels: Record<GapSeverity, string> = {
  green: 'On track',
  amber: 'Needs review',
  red: 'Critical gap',
}

interface HeatmapRow {
  studentId: string
  studentName: string
  topics: Record<string, GapSeverity>
}

export function ClassGapHeatmap({ heatmap }: { heatmap?: HeatmapRow[] }) {
  const matrix = heatmap ?? getClassGapMatrix()

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `140px repeat(${CLASS_TOPICS.length}, 1fr)` }}
        >
          <div />
          {CLASS_TOPICS.map((topic) => (
            <div
              key={topic}
              className="text-xs font-medium text-foreground text-center px-1 pb-2 truncate"
              title={topic}
            >
              {topic}
            </div>
          ))}

          {matrix.map((row) => (
            <Fragment key={row.studentId}>
              <Link
                href={`/teacher/students/${row.studentId}`}
                className="text-sm font-medium text-foreground py-2 pr-2 truncate hover:text-[var(--accent-primary)] transition-colors"
              >
                {row.studentName}
              </Link>
              {CLASS_TOPICS.map((topic) => {
                const severity = row.topics[topic] ?? 'green'
                return (
                  <div
                    key={`${row.studentId}-${topic}`}
                    className={cn(
                      'h-10 rounded-md border border-border/60 transition-all',
                      severityColors[severity]
                    )}
                    title={`${row.studentName} — ${topic}: ${severityLabels[severity]}`}
                  />
                )
              })}
            </Fragment>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6 text-xs text-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded gap-green" /> On track
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded gap-amber" /> Needs review
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded gap-red" /> Critical
          </span>
        </div>
      </div>
    </div>
  )
}
