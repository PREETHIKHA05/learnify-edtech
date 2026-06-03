'use client'

import { Card } from '@/shared/ui/card'
import { Users } from 'lucide-react'

interface PeerComparison {
  topic: string
  percentile: number
  message: string
  topPerformerStudy: string
}

export function PeerComparisonCard({ items }: { items: PeerComparison[] }) {
  if (items.length === 0) return null

  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Users className="w-5 h-5 text-[var(--accent-primary)]" />
        Peer Comparison (anonymised)
      </h3>
      {items.map((item) => (
        <div key={item.topic} className="p-4 rounded-lg bg-muted border border-border">
          <p className="text-sm font-medium text-foreground mb-1">{item.topic}</p>
          <p className="text-sm text-foreground mb-2">{item.message}</p>
          <p className="text-xs text-hint">Top 30% studied: {item.topPerformerStudy}</p>
        </div>
      ))}
    </Card>
  )
}
