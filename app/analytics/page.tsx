'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeatmapChart } from '@/components/HeatmapChart'
import { ScatterChart } from '@/components/ScatterChart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Award, Clock, Zap } from 'lucide-react'

const mockXpData = [
  { week: 'Week 1', xp: 520 },
  { week: 'Week 2', xp: 680 },
  { week: 'Week 3', xp: 750 },
  { week: 'Week 4', xp: 890 },
  { week: 'Week 5', xp: 1050 },
  { week: 'Week 6', xp: 1200 },
]

const mockTimeData = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 2.5 },
  { day: 'Fri', hours: 2.2 },
  { day: 'Sat', hours: 3.0 },
  { day: 'Sun', hours: 1.5 },
]

const mockTopicPerformance = [
  { topic: 'Calculus I', mastery: 78, confidence: 82 },
  { topic: 'Linear Algebra', mastery: 35, confidence: 45 },
  { topic: 'Statistics', mastery: 68, confidence: 72 },
  { topic: 'Probability', mastery: 42, confidence: 55 },
  { topic: 'Geometry', mastery: 85, confidence: 88 },
]

const mockScatterData = [
  { x: 85, y: 92, name: 'Calculus I' },
  { x: 45, y: 38, name: 'Linear Algebra' },
  { x: 92, y: 88, name: 'Statistics' },
  { x: 35, y: 42, name: 'Probability' },
  { x: 78, y: 85, name: 'Geometry' },
]

const mockHeatmap = Array.from({ length: 12 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
    count: (week * 7 + day) % 5,
  }))
).flat()

export default function Analytics() {
  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Analytics"
          subtitle="Comprehensive insights into your learning journey"
        />

        <main className="p-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total XP Earned</p>
                  <p className="text-3xl font-bold text-foreground">6,170</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Accuracy</p>
                  <p className="text-3xl font-bold text-foreground">72%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Topics Mastered</p>
                  <p className="text-3xl font-bold text-foreground">3/5</p>
                </div>
                <Award className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Study Hours</p>
                  <p className="text-3xl font-bold text-foreground">28.5h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
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
                  <LineChart data={mockXpData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                    <XAxis stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.15 0 0)',
                        border: '1px solid oklch(0.25 0 0)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="xp"
                      stroke="#22C55E"
                      strokeWidth={2}
                      dot={{ fill: '#22C55E', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Study Time Per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                    <XAxis stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.15 0 0)',
                        border: '1px solid oklch(0.25 0 0)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="hours" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Topic Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTopicPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                    <XAxis dataKey="topic" stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.15 0 0)',
                        border: '1px solid oklch(0.25 0 0)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="mastery" fill="#22C55E" name="Mastery %" />
                    <Bar dataKey="confidence" fill="#3B82F6" name="Confidence %" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Confidence vs Accuracy</h3>
                <ScatterChart
                  data={mockScatterData}
                  xLabel="Confidence"
                  yLabel="Accuracy"
                />
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="p-8 bg-card border-border">
                <HeatmapChart data={mockHeatmap} />
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded">
                    <p className="font-semibold text-green-400 mb-1">Strength: Calculus I</p>
                    <p className="text-sm text-foreground">
                      You've achieved 78% mastery with consistent growth. Keep building on this foundation.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
                    <p className="font-semibold text-yellow-400 mb-1">Gap: Linear Algebra</p>
                    <p className="text-sm text-foreground">
                      Confidence-accuracy mismatch detected. Focus on fundamental matrix operations.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                    <p className="font-semibold text-blue-400 mb-1">Improvement: Thursday Performance</p>
                    <p className="text-sm text-foreground">
                      You study 40% longer on Thursdays with higher accuracy rates. Consider this your peak day.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded">
                    <p className="font-semibold text-purple-400 mb-1">Recommendation: Spaced Repetition</p>
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
                    <p className="font-bold text-green-500">+450 XP (+18% vs previous)</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-foreground">Accuracy trend</p>
                    <p className="font-bold text-green-500">↑ +5% improvement</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-foreground">Consistency</p>
                    <p className="font-bold text-yellow-500">6/7 days studied</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </PageLayout>
    </>
  )
}
