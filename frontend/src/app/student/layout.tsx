'use client'

import { AuthGuard } from '@/widgets/layout/AuthGuard'
import { StudentNavigation } from '@/widgets/layout/StudentNavigation'
import { PageLayout } from '@/widgets/layout/PageLayout'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard role="student">
      <StudentNavigation />
      <PageLayout>{children}</PageLayout>
    </AuthGuard>
  )
}
