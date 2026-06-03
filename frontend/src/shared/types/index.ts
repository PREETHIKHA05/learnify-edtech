export type { GapStatus } from '@/shared/ui/common/gap-pill'
export type { User, UserRole, AuthSession } from '@/shared/types/auth'

export type GapTrend = 'improving' | 'stagnant' | 'widening'

export interface TopicGap {
  id: string
  topic: string
  severity: 'green' | 'amber' | 'red'
  confidence: number
  accuracy: number
  trend: GapTrend
  recommendedAction?: string
}
