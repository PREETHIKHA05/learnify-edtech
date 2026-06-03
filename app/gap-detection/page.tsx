'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScatterChart } from '@/components/ScatterChart'
import { TopicCard } from '@/components/TopicCard'
import { AlertCircle, TrendingUp } from 'lucide-react'

const mockScatterData = [
  { x: 85, y: 92, name: 'Calculus I' },
  { x: 45, y: 38, name: 'Linear Algebra' },
  { x: 92, y: 88, name: 'Statistics' },
  { x: 35, y: 42, name: 'Probability' },
  { x: 78, y: 85, name: 'Geometry' },
  { x: 62, y: 58, name: 'Trigonometry' },
  { x: 88, y: 90, name: 'Calculus II' },
  { x: 42, y: 35, name: 'Discrete Math' },
]

const criticalGaps = [
  {
    id: 1,
    title: 'Linear Algebra Fundamentals',
    description: 'Matrix operations and eigenvalues',
    status: 'critical' as const,
    progress: 20,
    severity: 'High - Blocks Advanced Topics',
  },
  {
    id: 2,
    title: 'Probability Basics',
    description: 'Conditional probability and independence',
    status: 'critical' as const,
    progress: 35,
    severity: 'High - Foundation Needed',
  },
  {
    id: 3,
    title: 'Discrete Mathematics',
    description: 'Set theory and logic',
    status: 'needs-review' as const,
    progress: 45,
    severity: 'Medium - Review Recommended',
  },
]

export default function GapDetection() {
  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Gap Detection"
          subtitle="AI-powered analysis of your knowledge gaps and weak areas"
        />

        <main className="p-8 space-y-8">
          {/* Alert Banner */}
          <Card className="p-4 bg-red-500/10 border border-red-500/50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Critical Gaps Detected</h3>
                <p className="text-sm text-red-300">
                  We found 2 critical knowledge gaps that are blocking your progress. Review them now to unlock advanced topics.
                </p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="critical">Critical Gaps</TabsTrigger>
              <TabsTrigger value="by-topic">By Topic</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-8 bg-card border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Confidence vs Accuracy Analysis</h2>
                <ScatterChart
                  data={mockScatterData}
                  xLabel="Confidence Level"
                  yLabel="Accuracy %"
                  title="Your Topics"
                />
                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">High Confidence & Accuracy</p>
                    <p className="text-2xl font-bold text-green-500">4 Topics</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Low Confidence & Accuracy</p>
                    <p className="text-2xl font-bold text-red-500">2 Topics</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Overconfident (Gap)</p>
                    <p className="text-2xl font-bold text-yellow-500">2 Topics</p>
                  </div>
                </div>
              </Card>

              {/* Insights */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Key Insights
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-foreground">
                      Strong foundation in Calculus and Statistics - ready for advanced topics
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold">!</span>
                    <span className="text-foreground">
                      Linear Algebra gaps are preventing progress in Applied Mathematics
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-500 font-bold">~</span>
                    <span className="text-foreground">
                      Over-confident in Trigonometry - more practice needed despite feeling prepared
                    </span>
                  </li>
                </ul>
              </Card>
            </TabsContent>

            {/* Critical Gaps Tab */}
            <TabsContent value="critical" className="space-y-4">
              <div className="space-y-3">
                {criticalGaps.map((gap) => (
                  <Card key={gap.id} className="p-4 bg-card border-border">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{gap.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{gap.description}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-red-500/20 text-red-400 rounded">
                        {gap.severity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${gap.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{gap.progress}% Mastered</span>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Fill This Gap
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* By Topic Tab */}
            <TabsContent value="by-topic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockScatterData.map((topic, idx) => (
                  <TopicCard
                    key={idx}
                    title={topic.name}
                    status={topic.y > 80 ? 'on-track' : topic.y > 50 ? 'needs-review' : 'critical'}
                    progress={topic.y}
                    description={`Confidence: ${topic.x}% | Accuracy: ${topic.y}%`}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recommended Learning Path</h3>
            <ol className="space-y-3">
              <li className="flex gap-3 text-sm">
                <span className="font-bold text-green-500">1.</span>
                <span className="text-foreground">
                  <strong>Start: Linear Algebra Basics</strong> - Master matrix operations (5-7 hours)
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="font-bold text-green-500">2.</span>
                <span className="text-foreground">
                  <strong>Then: Eigenvalues & Eigenvectors</strong> - Apply linear algebra (4-6 hours)
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="font-bold text-green-500">3.</span>
                <span className="text-foreground">
                  <strong>Finally: Probability Theory</strong> - Build on solid foundation (6-8 hours)
                </span>
              </li>
            </ol>
            <Button className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500">
              Start Learning Path
            </Button>
          </Card>
        </main>
      </PageLayout>
    </>
  )
}
