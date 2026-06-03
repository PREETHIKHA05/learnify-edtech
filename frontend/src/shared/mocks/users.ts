import type { User } from '@/shared/types/auth'

export const DEMO_STUDENT: User = {
  id: 'student-1',
  name: 'Alex Chen',
  email: 'alex.chen@student.learnify.demo',
  role: 'student',
  className: 'Math 10A',
}

export const DEMO_TEACHER: User = {
  id: 'teacher-1',
  name: 'Dr. Sarah Williams',
  email: 's.williams@teacher.learnify.demo',
  role: 'teacher',
  className: 'Math 10A',
}
