'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { HeatmapChart } from '@/widgets/charts/HeatmapChart'
import { ScatterChart } from '@/widgets/charts/ScatterChart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Award, Clock, Zap } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'
import { studentsApi, type AnalyticsData } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

const chartTooltipStyle = {
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '0.75rem',
  color: 'var(--text-primary)',
}

export default function Analytics() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    studentsApi.getAnalytics(studentId).then(setData).catch(() => {})
  }, [studentId])

  const xpData = data?.xpByWeek ?? []
  const timeData = data?.timeByDay ?? []
  const topicPerformance = data?.topicPerformance ?? []
  const scatterData = data?.scatterData ?? []
  const heatmapData = data?.heatmap ?? []
  const avgAccuracy = topicPerformance.length
    ? Math.round(topicPerformance.reduce((s, t) => s + t.mastery, 0) / topicPerformance.length)
    : 0
  const mastered = topicPerformance.filter((t) => t.mastery >= 70).length

  return (
    <>
                <Header
          title="Analytics"
          subtitle="Comprehensive insights into your learning journey"
        />

        <main className="p-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card border-border stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total XP Earned</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{(data?.totalXp ?? 0).toLocaleString()}</p>
                </div>
                <div className="icon-badge">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border stat-card-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Accuracy</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{avgAccuracy}%</p>
                </div>
                <div className="icon-badge icon-badge-secondary">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Topics Mastered</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{mastered}/{topicPerformance.length || '—'}</p>
                </div>
                <div className="icon-badge">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border stat-card-warn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Study Hours</p>
                  <p className="text-3xl font-bold text-foreground font-stat">{data?.totalStudyHours ?? '—'}h</p>
                </div>
                <div className="icon-badge icon-badge-warn">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">XP Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={xpData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                    <Line
                      type="monotone"
                      dataKey="xp"
                      stroke="var(--accent-primary)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--accent-primary)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Study Time Per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                    <Bar dataKey="hours" fill="var(--accent-secondary)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Topic Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topicPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="topic" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                    <Bar dataKey="mastery" fill="var(--accent-secondary)" name="Mastery %" />
                    <Bar dataKey="confidence" fill="var(--accent-primary)" name="Confidence %" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Confidence vs Accuracy</h3>
                <ScatterChart
                  data={scatterData}
                  xLabel="Confidence"
                  yLabel="Accuracy"
                />
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="p-8 bg-card border-border">
                <HeatmapChart data={heatmapData.length ? heatmapData : [{ week: 0, day: 'Mon', count: 0 }]} />
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted border-l-4 border-border rounded">
                    <p className="font-semibold text-foreground mb-1">Strength: Calculus I</p>
                    <p className="text-sm text-foreground">
                      You've achieved 78% mastery with consistent growth. Keep building on this foundation.
                    </p>
                  </div>

                  <div className="p-4 bg-muted border-l-4 border-yellow-500 rounded">
                    <p className="font-semibold text-yellow-400 mb-1">Gap: Linear Algebra</p>
                    <p className="text-sm text-foreground">
                      Confidence-accuracy mismatch detected. Focus on fundamental matrix operations.
                    </p>
                  </div>

                  <div className="p-4 bg-muted border-l-4 border-border rounded">
                    <p className="font-semibold text-muted-foreground mb-1">Improvement: Thursday Performance</p>
                    <p className="text-sm text-foreground">
                      You study 40% longer on Thursdays with higher accuracy rates. Consider this your peak day.
                    </p>
                  </div>

                  <div className="p-4 bg-muted border-l-4 border-border rounded">
                    <p className="font-semibold text-muted-foreground mb-1">Recommendation: Spaced Repetition</p>
                    <p className="text-sm text-foreground">
                      Start spaced repetition for Statistics and Probability to lock in learning.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Learning Velocity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground">Last 7 days</p>
                    <p className="font-bold text-foreground">+450 XP (+18% vs previous)</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-foreground">Accuracy trend</p>
                    <p className="font-bold text-foreground">↑ +5% improvement</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-foreground">Consistency</p>
                    <p className="font-bold text-muted-foreground">6/7 days studied</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
    </>
  )
}
