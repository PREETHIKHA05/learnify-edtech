'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react'

const weekSchedule = [
  {
    day: 'Monday',
    tasks: [
      { title: 'Derivatives - Power Rule', duration: '45 min', status: 'completed', xp: 100 },
      { title: 'Practice Problems', duration: '30 min', status: 'in-progress', xp: 50 },
    ],
  },
  {
    day: 'Tuesday',
    tasks: [
      { title: 'Chain Rule Basics', duration: '50 min', status: 'pending', xp: 120 },
      { title: 'Interactive Examples', duration: '25 min', status: 'pending', xp: 60 },
    ],
  },
  {
    day: 'Wednesday',
    tasks: [
      { title: 'Product & Quotient Rules', duration: '55 min', status: 'pending', xp: 130 },
    ],
  },
  {
    day: 'Thursday',
    tasks: [
      { title: 'Gap Review: Linear Algebra', duration: '60 min', status: 'pending', xp: 150 },
    ],
  },
  {
    day: 'Friday',
    tasks: [
      { title: 'Weekly Quiz', duration: '40 min', status: 'pending', xp: 100 },
      { title: 'Summary & Reflection', duration: '20 min', status: 'pending', xp: 50 },
    ],
  },
  {
    day: 'Saturday',
    tasks: [
      { title: 'Flashcard Review', duration: '30 min', status: 'pending', xp: 75 },
    ],
  },
  {
    day: 'Sunday',
    tasks: [
      { title: 'Rest & Planning', duration: 'Flexible', status: 'pending', xp: 0 },
    ],
  },
]

export default function StudyPlanner() {
  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Study Planner"
          subtitle="Personalized weekly learning schedule optimized for your goals"
        />

        <main className="p-8 space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-2">This Week XP</p>
              <p className="text-3xl font-bold text-green-500">1,250</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-2">Study Time</p>
              <p className="text-3xl font-bold text-blue-500">8h 45m</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-2">Tasks Completed</p>
              <p className="text-3xl font-bold text-purple-500">4/12</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-2">Streak</p>
              <p className="text-3xl font-bold text-yellow-500">12 Days</p>
            </Card>
          </div>

          <Tabs defaultValue="week" className="w-full">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="topics">By Topic</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            {/* Week View */}
            <TabsContent value="week" className="space-y-4">
              {weekSchedule.map((day) => (
                <Card key={day.day} className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {day.day}
                  </h3>
                  <div className="space-y-3">
                    {day.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                        <div className="flex-shrink-0">
                          {task.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          {task.status === 'in-progress' && (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                          )}
                          {task.status === 'pending' && (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
                          }`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            {task.duration}
                          </p>
                        </div>
                        {task.xp > 0 && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-yellow-500">
                            <Zap className="w-4 h-4" />
                            {task.xp}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* By Topic */}
            <TabsContent value="topics" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Topics & Progress</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Derivatives', progress: 75, time: '4h 30m', status: 'on-track' },
                    { name: 'Integration', progress: 45, time: '2h 15m', status: 'needs-review' },
                    { name: 'Limits', progress: 85, time: '3h 00m', status: 'on-track' },
                    { name: 'Linear Algebra', progress: 20, time: '1h 00m', status: 'critical' },
                  ].map((topic) => (
                    <div key={topic.name}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{topic.name}</p>
                        <p className="text-sm text-muted-foreground">{topic.progress}%</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              topic.status === 'on-track' ? 'bg-green-500' :
                              topic.status === 'needs-review' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground w-16 text-right">{topic.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Goals */}
            <TabsContent value="goals" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Goals</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-green-400">Short-term Goal</h4>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-foreground mb-2">Master derivatives by end of week</p>
                    <div className="w-full h-2 bg-green-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">85% Complete</p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-400">Mid-term Goal</h4>
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-foreground mb-2">Complete Calculus I by end of month</p>
                    <div className="w-full h-2 bg-blue-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">45% Complete</p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-purple-400">Long-term Goal</h4>
                      <AlertCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-sm text-foreground mb-2">Master Mathematics for competitive exam</p>
                    <div className="w-full h-2 bg-purple-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">30% Complete</p>
                  </div>
                </div>
              </Card>

              <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 py-6">
                Create New Goal
              </Button>
            </TabsContent>
          </Tabs>
        </main>
      </PageLayout>
    </>
  )
}
