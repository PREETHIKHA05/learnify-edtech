'use client'

import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Play, Pause, RotateCcw, Coffee, AlertCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/auth-context'
import { focusApi } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

export default function FocusRoom() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [mode, setMode] = useState<'work' | 'break'>('work')
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const completedWorkRef = useRef(false)

  useEffect(() => {
    focusApi.list(studentId).then((sessions) => {
      setSessionsCompleted(sessions.filter((s) => s.mode === 'work').length)
    }).catch(() => {})
  }, [studentId])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          setIsRunning(false)
          const finishedMode = mode
          setMode(mode === 'work' ? 'break' : 'work')
          setMinutes(mode === 'work' ? 5 : 25)
          setSeconds(0)
          if (finishedMode === 'work' && !completedWorkRef.current) {
            completedWorkRef.current = true
            focusApi.record(studentId, 'work', 25).then((res) => {
              setSessionsCompleted(res.sessionsCompleted)
              completedWorkRef.current = false
            }).catch(() => { completedWorkRef.current = false })
          }
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, minutes, seconds, mode, sessionsCompleted])

  const handleReset = () => {
    setIsRunning(false)
    setMinutes(mode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  const handleModeSwitch = (newMode: 'work' | 'break') => {
    setMode(newMode)
    setIsRunning(false)
    setMinutes(newMode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  const percentage = mode === 'work'
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100

  return (
    <>
                <Header
          title="Focus Room"
          subtitle="Pomodoro timer with distraction tracking and study analytics"
          showSearch={false}
        />

        <main className="p-8 space-y-8">
          {/* Main Timer */}
          <div className="flex justify-center">
            <Card className={`w-full max-w-md p-12 bg-muted ${
              mode === 'work'
                ? 'bg-muted border-border'
                : 'bg-card border-border'
            } border-2`}>
              <div className="text-center space-y-6">
                {/* Mode Badge */}
                <div className="inline-block px-4 py-2 rounded-full bg-muted">
                  <p className="text-sm font-semibold text-foreground">
                    {mode === 'work' ? '⚡ Focus Time' : '☕ Break Time'}
                  </p>
                </div>

                {/* Timer Display */}
                <div className="space-y-2">
                  <p className="text-7xl font-bold text-foreground tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </p>
                  <p className="text-muted-foreground">
                    {mode === 'work' ? 'Focus on your studies' : 'Take a well-deserved break'}
                  </p>
                </div>

                {/* Progress Ring */}
                <div className="flex justify-center">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="var(--bg-overlay)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke={mode === 'work' ? 'var(--accent-secondary)' : 'var(--accent-primary)'}
                      strokeWidth="4"
                      strokeDasharray={`${(percentage / 100) * 314.159} 314.159`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>

                {/* Controls */}
                <div className="flex gap-3 justify-center">
                  <Button
                    size="icon"
                    onClick={() => setIsRunning(!isRunning)}
                    className={`w-12 h-12 rounded-full ${
                      isRunning
                        ? 'bg-[var(--accent-warn)] hover:bg-[color-mix(in_srgb,var(--accent-warn)_85%,black)]'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {isRunning ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleReset}
                    className="w-12 h-12 rounded-full"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mode Switch */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant={mode === 'work' ? 'default' : 'outline'}
                    onClick={() => handleModeSwitch('work')}
                    size="sm"
                  >
                    Work (25m)
                  </Button>
                  <Button
                    variant={mode === 'break' ? 'default' : 'outline'}
                    onClick={() => handleModeSwitch('break')}
                    size="sm"
                    className="gap-2"
                  >
                    <Coffee className="w-4 h-4" />
                    Break (5m)
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-card border-border text-center">
              <p className="text-muted-foreground mb-2 text-sm">Sessions Completed</p>
              <p className="text-4xl font-bold text-foreground">{sessionsCompleted}</p>
            </Card>
            <Card className="p-6 bg-card border-border text-center">
              <p className="text-muted-foreground mb-2 text-sm">Focus Time Today</p>
              <p className="text-4xl font-bold text-muted-foreground">{sessionsCompleted * 25}m</p>
            </Card>
            <Card className="p-6 bg-card border-border text-center">
              <p className="text-muted-foreground mb-2 text-sm">XP Earned</p>
              <p className="text-4xl font-bold text-muted-foreground">{sessionsCompleted * 50}</p>
            </Card>
          </div>

          {/* Current Task */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">What are you focusing on?</h3>
            <div className="space-y-3">
              {[
                'Derivatives - Power Rule',
                'Integration by Parts',
                'Chain Rule Practice',
                'Practice Problems',
              ].map((task, idx) => (
                <button
                  key={idx}
                  className="w-full p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted transition-all"
                >
                  {task}
                </button>
              ))}
            </div>
          </Card>

          {/* Distractions */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              Distractions Tracked
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Phone notifications', count: 3 },
                { name: 'Switching tabs', count: 5 },
                { name: 'Web browsing', count: 2 },
              ].map((distraction, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                  <p className="text-sm text-foreground">{distraction.name}</p>
                  <span className="text-sm font-semibold text-orange-500">{distraction.count}x</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Focus Tips */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Focus Tips</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex gap-3">
                <span className="text-foreground">✓</span>
                <span>Silence your phone during focus sessions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground">✓</span>
                <span>Close unnecessary browser tabs and apps</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground">✓</span>
                <span>Take your break away from your desk</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground">✓</span>
                <span>After 4 sessions, take a longer 15-30 minute break</span>
              </li>
            </ul>
          </Card>
        </main>
    </>
  )
}
