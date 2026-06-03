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
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
          <XAxis
            dataKey="x"
            label={{ value: xLabel, position: 'insideBottomRight', offset: -10 }}
            stroke="oklch(0.65 0 0)"
          />
          <YAxis
            dataKey="y"
            label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
            stroke="oklch(0.65 0 0)"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'oklch(0.15 0 0)',
              border: '1px solid oklch(0.25 0 0)',
              borderRadius: '0.5rem',
            }}
            formatter={(value) => value.toFixed(1)}
          />
          <Legend />
          <Scatter name={title || 'Topics'} data={data} fill="oklch(0.7 0.2 142.5)" />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
