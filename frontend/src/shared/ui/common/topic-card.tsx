import { Card } from '@/shared/ui/card'
import { GapPill, type GapStatus } from './gap-pill'
import { ChevronRight } from 'lucide-react'

const progressClasses: Record<GapStatus, string> = {
  'on-track': 'progress-bar-success',
  'needs-review': 'progress-bar-warn',
  critical: 'progress-bar-danger',
}

interface TopicCardProps {
  title: string
  description?: string
  status: GapStatus
  progress?: number
  xp?: number
  onClick?: () => void
  className?: string
}

export function TopicCard({
  title,
  description,
  status,
  progress = 0,
  xp,
  onClick,
  className = '',
}: TopicCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`p-4 bg-card border-border hover:border-[var(--border-default)] transition-all cursor-pointer group ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          )}
          {progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
              <div
                className={`${progressClasses[status]} h-full transition-all rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <GapPill status={status} size="sm" />
            {xp !== undefined && xp > 0 && (
              <span className="text-xs text-[var(--accent-secondary)] font-medium font-stat">+{xp} XP</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[var(--accent-primary)] transition-colors mt-1" />
      </div>
    </Card>
  )
}
