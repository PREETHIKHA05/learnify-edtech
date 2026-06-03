'use client'

import { Card } from '@/shared/ui/card'
import { GapTrendBadge } from './gap-trend-badge'
import type { GapTrend } from '@/shared/types'

interface ClosureItem {
  topic: string
  before: number
  after: number
  trend: GapTrend
}

export function GapClosureTracker({ items }: { items: ClosureItem[] }) {
  if (items.length === 0) return null

  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Gap Closure Progress</h3>
      <p className="text-sm text-foreground">Before/after mastery as you complete recommended content</p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.topic}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{item.topic}</span>
              <GapTrendBadge trend={item.trend} />
            </div>
            <div className="flex items-center gap-3 text-sm font-stat">
              <span className="text-hint">{item.before}%</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--bg-overlay)] rounded-full"
                  style={{ width: `${item.before}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 progress-bar-fill rounded-full opacity-90"
                  style={{ width: `${item.after}%` }}
                />
              </div>
              <span className="text-[var(--accent-secondary)] font-semibold">{item.after}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
