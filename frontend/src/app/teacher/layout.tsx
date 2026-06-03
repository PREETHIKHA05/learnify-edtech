'use client'

import { AuthGuard } from '@/widgets/layout/AuthGuard'
import { TeacherNavigation } from '@/widgets/layout/TeacherNavigation'
import { PageLayout } from '@/widgets/layout/PageLayout'

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard role="teacher">
      <TeacherNavigation />
      <PageLayout>{children}</PageLayout>
    </AuthGuard>
  )
}
