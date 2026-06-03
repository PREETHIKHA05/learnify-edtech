'use client'

interface HeatmapDataPoint {
  day: string
  week: number
  count: number
}

interface HeatmapChartProps {
  data: HeatmapDataPoint[]
  title?: string
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function HeatmapChart({ data, title = 'Study Activity' }: HeatmapChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    const ratio = count / maxCount
    if (ratio < 0.34) return 'heatmap-low'
    if (ratio < 0.67) return 'heatmap-mid'
    return 'heatmap-high'
  }

  const weeks = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {weeks.map((week) => (
          <div key={week} className="flex flex-col gap-2">
            <div className="text-xs text-muted-foreground text-center font-medium mb-1 font-stat">
              W{week + 1}
            </div>
            <div className="flex flex-col gap-1">
              {days.map((day) => {
                const point = data.find((d) => d.week === week && d.day === day)
                const count = point?.count || 0
                return (
                  <div
                    key={`${week}-${day}`}
                    className={`w-8 h-8 rounded-md border border-border/60 ${getColor(count)} transition-all`}
                    title={`${day} Week ${week + 1}: ${count} activities`}
                  />
                )
              })}
            </div>
            <div className="text-xs text-muted-foreground text-center font-stat">
              {data.filter((d) => d.week === week).reduce((sum, d) => sum + d.count, 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
