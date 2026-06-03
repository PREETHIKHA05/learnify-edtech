import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Mail, Send } from 'lucide-react'

interface DigestData {
  criticalCount: number
  totalGaps: number
  topCluster: string
  pendingBulk: number
}

export function WeeklyDigestCard({ digest }: { digest?: DigestData }) {
  const criticalCount = digest?.criticalCount ?? 0
  const totalGaps = digest?.totalGaps ?? 0
  const topCluster = digest?.topCluster ?? 'Fractions'
  const pendingBulk = digest?.pendingBulk ?? 3

  return (
    <Card className="p-6 bg-card border-border border-l-[3px] border-l-[var(--accent-primary)]">
      <div className="flex items-start gap-4">
        <div className="icon-badge">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-foreground mb-1">Weekly Gap Summary · Math 10A</p>
          <h3 className="text-lg font-semibold text-foreground mb-2">Class digest ready to send</h3>
          <div className="text-sm text-foreground space-y-1 mb-4">
            <p>• {criticalCount} students flagged as at-risk this week</p>
            <p>• {totalGaps} total topic gaps across the class</p>
            <p>• Top cluster: {topCluster} (multiple students struggling simultaneously)</p>
            <p>• {pendingBulk} recommended bulk interventions pending</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-2">
              <Send className="w-3 h-3" />
              Preview & Send Digest
            </Button>
            <Button size="sm" variant="outline">
              Schedule for Monday
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
