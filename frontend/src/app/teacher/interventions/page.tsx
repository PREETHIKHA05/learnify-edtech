'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { InterventionCards } from '@/features/teacher/InterventionCards'
import { teacherApi, type TeacherDashboard } from '@/services'
import { MOCK_CLASS_STUDENTS } from '@/shared/mocks/students'

export default function TeacherInterventionsPage() {
  const [students, setStudents] = useState(MOCK_CLASS_STUDENTS)

  useEffect(() => {
    teacherApi.getDashboard().then((d: TeacherDashboard) => setStudents(d.students)).catch(() => {})
  }, [])

  return (
    <>
      <Header
        title="Suggested Interventions"
        subtitle="AI-recommended actions per student based on gap analysis"
      />
      <main className="p-8">
        <InterventionCards students={students} />
      </main>
    </>
  )
}
