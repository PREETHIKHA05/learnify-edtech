import type { ClassStudent, GapSeverity } from '@/shared/mocks/students'
import type { GapTrend } from '@/shared/types'
import { apiFetch } from './api-client'

export interface GapReport {
  student: {
    id: string
    name: string
    email: string
    streak: number
    topicsNeedingAttention: number
    overallGapScore: number
  }
  summary: { criticalCount: number; alertMessage: string }
  gaps: Array<{
    topic: string
    severity: GapSeverity
    confidence: number
    accuracy: number
    trend: GapTrend
    timeOnTopicHours: number
    notesEngagement: number
    quizScore: number
    recommendedAction: string
    closureBefore?: number
    closureAfter?: number
    peerPercentile?: number
  }>
  scatterData: Array<{ x: number; y: number; name: string }>
  peerComparisons: Array<{ topic: string; percentile: number; message: string; topPerformerStudy: string }>
  closureProgress: Array<{ topic: string; before: number; after: number; trend: GapTrend }>
  notesFlags: Array<{ topic: string; message: string }>
  streakNudge: { message: string; urgency: number } | null
  learningPath: Array<{ step: number; topic: string; action: string; hours: string }>
}

export interface StudentDashboard {
  alertMessage: string
  topics: Array<{ title: string; description: string; status: 'on-track' | 'needs-review' | 'critical'; progress: number; xp: number }>
  streak: number
  xp: number
  level: number
  masteryPercent: number
  heatmap: Array<{ week: number; day: string; count: number }>
  stats: { topicsOnTrack: number; topicsNeedReview: number; topicsCritical: number; studyHoursWeek: number }
}

export interface TeacherDashboard {
  totalStudents: number
  atRiskCount: number
  avgGapScore: number
  pendingInterventions: number
  students: ClassStudent[]
  heatmap: Array<{ studentId: string; studentName: string; topics: Record<string, GapSeverity> }>
  clusters: Array<{ topic: string; red: number; amber: number; students: string[]; total: number }>
  digest: { criticalCount: number; totalGaps: number; topCluster: string; pendingBulk: number }
}

export interface AppNotification {
  id: string
  userId: string
  role: string
  type: string
  urgency: number
  title: string
  message: string
  read: boolean
  timestamp: string
}

export interface TeacherFeedback {
  id: string
  studentId: string
  teacherId: string
  teacherName: string
  type: string
  message: string
  createdAt: string
}

export interface QuizQuestion {
  id: number
  question: string
  type: string
  options: string[]
  correct: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  topic: string
  questions: QuizQuestion[]
}

export interface Note {
  id: string
  studentId: string
  title: string
  topic: string
  content: string
  preview: string
  keyPoints: string[]
  status: string
  shallowFlag: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FlashcardDeck {
  id: string
  studentId: string
  topic: string
  cards: Array<{ id: number; front: string; back: string; difficulty: string }>
}

export interface StudyPlan {
  id: string
  studentId: string
  weekSchedule: Array<{ day: string; tasks: Array<{ title: string; duration: string; status: string; xp: number }> }>
  stats: { weekXp: number; studyTime: string; tasksCompleted: number; totalTasks: number }
}

export interface AnalyticsData {
  id: string
  studentId: string
  totalXp: number
  totalStudyHours: number
  avgSessionMinutes: number
  badgesEarned: number
  xpByWeek: Array<{ week: string; xp: number }>
  timeByDay: Array<{ day: string; hours: number }>
  topicPerformance: Array<{ topic: string; mastery: number; confidence: number }>
  scatterData: Array<{ x: number; y: number; name: string }>
  heatmap: Array<{ week: number; day: string; count: number }>
}

export interface TutorMessage {
  id: string
  studentId: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher'
  className: string
}

export const authApi = {
  demoLogin: (role: 'student' | 'teacher') =>
    apiFetch<{ user: AuthUser; token: string }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
}

export const gapsApi = {
  getReport: (studentId: string) => apiFetch<GapReport>(`/api/students/${studentId}/gap-report`),
}

export const studentsApi = {
  getAll: () => apiFetch<ClassStudent[]>('/api/students'),
  getById: (id: string) => apiFetch<ClassStudent>(`/api/students/${id}`),
  getDashboard: (id: string) => apiFetch<StudentDashboard>(`/api/students/${id}/dashboard`),
  getAnalytics: (id: string) => apiFetch<AnalyticsData>(`/api/students/${id}/analytics`),
}

export const teacherApi = {
  getDashboard: () => apiFetch<TeacherDashboard>('/api/teacher/dashboard'),
  bulkIntervention: (studentIds: string[], action: string) =>
    apiFetch<{ count: number; action: string }>('/api/interventions/bulk', {
      method: 'POST',
      body: JSON.stringify({ studentIds, action }),
    }),
  applyIntervention: (studentId: string, action: string, appliedBy?: string) =>
    apiFetch('/api/interventions/apply', {
      method: 'POST',
      body: JSON.stringify({ studentId, action, appliedBy }),
    }),
  getTopics: () => apiFetch<string[]>('/api/topics'),
}

export const notificationsApi = {
  list: (userId: string, role: string) =>
    apiFetch<AppNotification[]>(`/api/notifications?userId=${userId}&role=${role}`),
  markRead: (id: string) =>
    apiFetch<AppNotification>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: (userId: string, role: string) =>
    apiFetch<AppNotification[]>('/api/notifications/read-all', {
      method: 'PATCH',
      body: JSON.stringify({ userId, role }),
    }),
}

export const feedbackApi = {
  list: (studentId: string) => apiFetch<TeacherFeedback[]>(`/api/feedback/${studentId}`),
  send: (payload: { studentId: string; teacherId?: string; teacherName?: string; message: string; type?: string }) =>
    apiFetch<TeacherFeedback>('/api/feedback', { method: 'POST', body: JSON.stringify(payload) }),
}

export const quizApi = {
  list: (topic?: string) => apiFetch<Quiz[]>(`/api/quizzes${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`),
  getById: (id: string) => apiFetch<Quiz>(`/api/quizzes/${id}`),
  submitFeedback: (studentId: string, payload: { correct: boolean; timeMultiplier: number; topic: string; shallowNotes?: boolean }) =>
    apiFetch<{ insights: Array<{ type: string; message: string }> }>('/api/quiz/feedback', {
      method: 'POST',
      body: JSON.stringify({ studentId, ...payload }),
    }),
  submitAttempt: (quizId: string, studentId: string, answers: (number | null)[], timeSpent?: number[]) =>
    apiFetch<{ score: number; insights: Array<{ type: string; message: string }> }>(`/api/quizzes/${quizId}/attempts`, {
      method: 'POST',
      body: JSON.stringify({ studentId, answers, timeSpent }),
    }),
}

export const notesApi = {
  list: (studentId: string) => apiFetch<Note[]>(`/api/students/${studentId}/notes`),
  create: (studentId: string, data: { title: string; topic: string; content?: string; keyPoints?: string[] }) =>
    apiFetch<Note>(`/api/students/${studentId}/notes`, { method: 'POST', body: JSON.stringify(data) }),
  update: (noteId: string, data: Partial<Note>) =>
    apiFetch<Note>(`/api/notes/${noteId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (noteId: string) => apiFetch(`/api/notes/${noteId}`, { method: 'DELETE' }),
}

export const flashcardsApi = {
  getDeck: (studentId: string) => apiFetch<FlashcardDeck>(`/api/students/${studentId}/flashcards`),
  review: (studentId: string, cardId: number, difficulty: string) =>
    apiFetch(`/api/students/${studentId}/flashcards/review`, {
      method: 'POST',
      body: JSON.stringify({ cardId, difficulty }),
    }),
}

export const studyPlanApi = {
  get: (studentId: string) => apiFetch<StudyPlan>(`/api/students/${studentId}/study-plan`),
  updateTask: (studentId: string, day: string, taskIndex: number, status: string) =>
    apiFetch<StudyPlan>(`/api/students/${studentId}/study-plan/tasks`, {
      method: 'PATCH',
      body: JSON.stringify({ day, taskIndex, status }),
    }),
}

export const focusApi = {
  list: (studentId: string) => apiFetch<Array<{ id: string; mode: string; durationMinutes: number; completedAt: string }>>(`/api/students/${studentId}/focus-sessions`),
  record: (studentId: string, mode: 'work' | 'break', durationMinutes: number) =>
    apiFetch<{ sessionsCompleted: number }>(`/api/students/${studentId}/focus-sessions`, {
      method: 'POST',
      body: JSON.stringify({ mode, durationMinutes }),
    }),
}

export const tutorApi = {
  getMessages: (studentId: string) => apiFetch<TutorMessage[]>(`/api/students/${studentId}/tutor/messages`),
  send: (studentId: string, content: string) =>
    apiFetch<{ user: TutorMessage; assistant: TutorMessage }>(`/api/students/${studentId}/tutor/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
}

export { API_BASE_URL } from './api-client'
