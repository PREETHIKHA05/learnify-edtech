import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

export type GapStatus = 'on-track' | 'needs-review' | 'critical'

interface GapPillProps {
  status: GapStatus
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function GapPill({ status, label, size = 'md' }: GapPillProps) {
  const config = {
    'on-track': {
      bg: 'bg-green-500/20',
      border: 'border-green-500/50',
      icon: CheckCircle2,
      text: 'text-green-400',
      label: label || 'On Track',
    },
    'needs-review': {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      icon: AlertCircle,
      text: 'text-amber-400',
      label: label || 'Needs Review',
    },
    'critical': {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      icon: XCircle,
      text: 'text-red-400',
      label: label || 'Critical',
    },
  }

  const { bg, border, icon: Icon, text, label: defaultLabel } = config[status]

  const sizeClasses = {
    sm: 'px-2 py-1 gap-1 text-xs',
    md: 'px-3 py-1.5 gap-2 text-sm',
    lg: 'px-4 py-2 gap-2 text-base',
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border ${bg} ${border} ${sizeClasses[size]}`}
    >
      <Icon className={`w-4 h-4 ${text}`} />
      <span className={`font-medium ${text}`}>{defaultLabel}</span>
    </div>
  )
}
