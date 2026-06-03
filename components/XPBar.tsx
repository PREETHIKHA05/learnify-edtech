interface XPBarProps {
  current: number
  max: number
  level: number
  showLabel?: boolean
  animated?: boolean
}

export function XPBar({ current, max, level, showLabel = true, animated = true }: XPBarProps) {
  const percentage = (current / max) * 100

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Level {level}</span>
          <span className="text-xs text-muted-foreground">{current.toLocaleString()} / {max.toLocaleString()} XP</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-full rounded-full ${
            animated ? 'transition-all duration-500' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
