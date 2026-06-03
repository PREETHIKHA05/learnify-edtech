'use client'

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  x: number
  y: number
  name: string
  fill?: string
}

interface ScatterChartProps {
  data: DataPoint[]
  xLabel?: string
  yLabel?: string
  title?: string
}

export function ScatterChart({ data, xLabel = 'Confidence', yLabel = 'Accuracy', title }: ScatterChartProps) {
  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="x"
            label={{ value: xLabel, position: 'insideBottomRight', offset: -10, fill: 'var(--text-muted)' }}
            stroke="var(--text-muted)"
            tick={{ fill: 'var(--text-muted)' }}
          />
          <YAxis
            dataKey="y"
            label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }}
            stroke="var(--text-muted)"
            tick={{ fill: 'var(--text-muted)' }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: 'var(--border-default)' }}
            contentStyle={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
            }}
            formatter={(value) => Number(value).toFixed(1)}
          />
          <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
          <Scatter name={title || 'Topics'} data={data} fill="var(--accent-primary)" />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
