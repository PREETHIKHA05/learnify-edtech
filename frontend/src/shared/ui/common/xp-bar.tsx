interface XPBarProps {
  current: number
  max: number
  level: number
}

export function XPBar({ current, max, level }: XPBarProps) {
  const percentage = Math.min((current / max) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Level <span className="font-stat">{level}</span>{' '}
          <span className="text-[var(--accent-primary)] font-semibold">·</span>{' '}
          <span className="text-[var(--accent-secondary)]">Keep going!</span>
        </span>
        <span className="text-muted-foreground font-stat">
          {current.toLocaleString()} / {max.toLocaleString()} XP
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="progress-bar-fill h-full rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
