import { Card } from '@/shared/ui/card'
import type { ClassStudent } from '@/shared/mocks/students'
import { getTopicWeaknessClusters } from '@/shared/mocks/students'

interface Cluster {
  topic: string
  red: number
  amber: number
  students: string[]
  total: number
}

export function TopicWeaknessClusters({ clusters }: { clusters?: Cluster[] }) {
  const data = clusters ?? getTopicWeaknessClusters()

  return (
    <div className="space-y-3">
      {data.map((cluster) => (
        <Card key={cluster.topic} className="p-4 bg-card border-border">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="font-semibold text-foreground">{cluster.topic}</h4>
            <div className="flex gap-2 text-xs">
              {cluster.red > 0 && (
                <span className="px-2 py-0.5 badge-critical rounded font-medium text-xs">
                  {cluster.red} critical
                </span>
              )}
              {cluster.amber > 0 && (
                <span className="px-2 py-0.5 badge-needs-review rounded font-medium text-xs">
                  {cluster.amber} review
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-foreground">
            Struggling: {cluster.students.slice(0, 4).join(', ')}
            {cluster.students.length > 4 && ` +${cluster.students.length - 4} more`}
          </p>
        </Card>
      ))}
    </div>
  )
}
