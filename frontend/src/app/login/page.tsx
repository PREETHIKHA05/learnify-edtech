'use client'



import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react'

import { Button } from '@/shared/ui/button'

import { Card } from '@/shared/ui/card'

import { useAuth, getPortalPath } from '@/features/auth/auth-context'

import { DEMO_STUDENT, DEMO_TEACHER } from '@/shared/mocks/users'

import { Logo } from '@/shared/ui/logo'



export default function LoginPage() {

  const { user, isLoading, loginAsDemo } = useAuth()

  const router = useRouter()



  useEffect(() => {

    if (isLoading || !user) return

    router.replace(getPortalPath(user.role))

  }, [user, isLoading, router])



  const handleLogin = (role: 'student' | 'teacher') => {

    loginAsDemo(role)

    router.replace(getPortalPath(role))

  }



  if (isLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-background">

        <p className="text-muted-foreground">Loading...</p>

      </div>

    )

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-background p-6">

      <div className="w-full max-w-4xl space-y-8">

        <div className="text-center space-y-3">

          <div className="flex justify-center">

            <Logo accent="primary" size="lg" className="items-center" />

          </div>

          <p className="text-muted-foreground max-w-lg mx-auto">

            Learning gap detection for students and teachers. Pick a portal to explore.

          </p>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="p-8 bg-card border border-border stat-card hover:border-[var(--border-default)] transition-all">

            <div className="flex flex-col h-full">

              <div className="icon-badge mb-4">

                <GraduationCap className="w-5 h-5" />

              </div>

              <h2 className="text-lg font-bold text-foreground mb-2">Student Portal</h2>

              <p className="text-sm text-muted-foreground mb-4 flex-1">

                Personal gap reports, quizzes, notes, and progress tracking.

              </p>

              <div className="p-3 bg-muted rounded-lg mb-6 text-sm border border-border">

                <p className="text-muted-foreground">Demo account</p>

                <p className="font-medium text-foreground">{DEMO_STUDENT.name}</p>

                <p className="text-xs text-muted-foreground">{DEMO_STUDENT.email}</p>

              </div>

              <Button onClick={() => handleLogin('student')} className="w-full gap-2">

                Enter as Student

                <ArrowRight className="w-4 h-4" />

              </Button>

            </div>

          </Card>



          <Card className="p-8 bg-card border border-border stat-card-secondary hover:border-[var(--border-default)] transition-all">

            <div className="flex flex-col h-full">

              <div className="icon-badge icon-badge-secondary mb-4">

                <BookOpen className="w-5 h-5" />

              </div>

              <h2 className="text-lg font-bold text-foreground mb-2">Teacher Portal</h2>

              <p className="text-sm text-muted-foreground mb-4 flex-1">

                Class gap dashboard, student reports, and interventions.

              </p>

              <div className="p-3 bg-muted rounded-lg mb-6 text-sm border border-border">

                <p className="text-muted-foreground">Demo account</p>

                <p className="font-medium text-foreground">{DEMO_TEACHER.name}</p>

                <p className="text-xs text-muted-foreground">{DEMO_TEACHER.email}</p>

              </div>

              <Button

                onClick={() => handleLogin('teacher')}

                variant="secondary"

                className="w-full gap-2 bg-[var(--accent-secondary)] text-[var(--bg-base)] hover:bg-[color-mix(in_srgb,var(--accent-secondary)_85%,white)]"

              >

                Enter as Teacher

                <ArrowRight className="w-4 h-4" />

              </Button>

            </div>

          </Card>

        </div>



        <p className="text-center text-xs text-hint">

          Demo mode — no password required. Logout from the sidebar to switch roles.

        </p>

      </div>

    </div>

  )

}

