'use client'

import { TrendingDown, Minus, TrendingUp } from 'lucide-react'
import type { GapTrend } from '@/shared/types'

const config: Record<
  GapTrend,
  { icon: typeof TrendingUp; label: string; className: string }
> = {
  improving: { icon: TrendingUp, label: 'Improving', className: 'badge-on-track' },
  stagnant: { icon: Minus, label: 'Stagnant', className: 'badge-needs-review' },
  widening: { icon: TrendingDown, label: 'Widening', className: 'badge-critical' },
}

export function GapTrendBadge({ trend }: { trend: GapTrend }) {
  const { icon: Icon, label, className } = config[trend]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}
