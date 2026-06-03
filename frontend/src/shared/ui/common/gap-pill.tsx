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
      badge: 'badge-on-track',
      icon: CheckCircle2,
      label: label || 'On Track',
    },
    'needs-review': {
      badge: 'badge-needs-review',
      icon: AlertCircle,
      label: label || 'Needs Review',
    },
    critical: {
      badge: 'badge-critical',
      icon: XCircle,
      label: label || 'Critical',
    },
  }

  const { badge, icon: Icon, label: defaultLabel } = config[status]

  const sizeClasses = {
    sm: 'px-2 py-1 gap-1 text-xs',
    md: 'px-3 py-1.5 gap-2 text-sm',
    lg: 'px-4 py-2 gap-2 text-base',
  }

  return (
    <div className={`inline-flex items-center rounded-full ${badge} ${sizeClasses[size]}`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium">{defaultLabel}</span>
    </div>
  )
}
