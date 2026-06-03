interface MasteryMeterProps {
  score: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MasteryMeter({ score, label = 'Mastery', size = 'md' }: MasteryMeterProps) {
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const stroke =
    score >= 80
      ? 'var(--accent-secondary)'
      : score >= 50
        ? 'var(--accent-warn)'
        : 'var(--accent-danger)'

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeClasses[size]}`}>
      <svg
        className="transform -rotate-90"
        width={radius * 2 + 10}
        height={radius * 2 + 10}
        viewBox={`0 0 ${radius * 2 + 10} ${radius * 2 + 10}`}
      >
        <circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          fill="none"
          stroke="var(--bg-overlay)"
          strokeWidth="3"
        />
        <circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold text-foreground font-stat ${textSizeClasses[size]}`}>{score}%</span>
        <span className={`text-muted-foreground ${labelSizeClasses[size]}`}>{label}</span>
      </div>
    </div>
  )
}
