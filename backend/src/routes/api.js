import express from 'express'
import {
  getDemoUser,
  getAllStudents,
  getStudentById,
  getStudentGapReport,
  getStudentDashboard,
  getTeacherDashboard,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  addFeedback,
  getFeedbackForStudent,
  applyBulkIntervention,
  applyIntervention,
  getInterventionsForStudent,
  submitQuizFeedback,
  submitQuizAttempt,
  getQuizzes,
  getQuizById,
  getClassTopics,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getFlashcardDeck,
  reviewFlashcard,
  getStudyPlan,
  updateStudyTask,
  getFocusSessions,
  recordFocusSession,
  getAnalytics,
  getTutorMessages,
  sendTutorMessage,
} from '../services/index.js'
import { listCollections, getAllDocumentCounts } from '../data/seedRunner.js'
import { isConnected } from '../db/connect.js'

const router = express.Router()

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/health', asyncHandler(async (_req, res) => {
  const collections = isConnected() ? await listCollections() : []
  const counts = isConnected() ? await getAllDocumentCounts() : {}
  res.json({
    ok: true,
    service: 'learnify-api',
    database: isConnected() ? 'mongodb' : 'disconnected',
    dbName: 'learnify',
    collections,
    documentCounts: counts,
  })
}))

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/demo-login', asyncHandler(async (req, res) => {
  const role = req.body?.role
  if (role !== 'student' && role !== 'teacher') {
    return res.status(400).json({ error: 'Invalid role' })
  }
  const user = await getDemoUser(role)
  res.json({ user, token: `demo-token-${user.id}` })
}))

// ─── Students & gaps ──────────────────────────────────────────────────────────
router.get('/students', asyncHandler(async (_req, res) => {
  res.json(await getAllStudents())
}))

router.get('/students/:id', asyncHandler(async (req, res) => {
  const student = await getStudentById(req.params.id)
  if (!student) return res.status(404).json({ error: 'Student not found' })
  res.json(student)
}))

router.get('/students/:id/gap-report', asyncHandler(async (req, res) => {
  const report = await getStudentGapReport(req.params.id)
  if (!report) return res.status(404).json({ error: 'Student not found' })
  res.json(report)
}))

router.get('/students/:id/dashboard', asyncHandler(async (req, res) => {
  const dashboard = await getStudentDashboard(req.params.id)
  if (!dashboard) return res.status(404).json({ error: 'Student not found' })
  res.json(dashboard)
}))

router.get('/students/:id/analytics', asyncHandler(async (req, res) => {
  res.json(await getAnalytics(req.params.id))
}))

router.get('/students/:id/interventions', asyncHandler(async (req, res) => {
  res.json(await getInterventionsForStudent(req.params.id))
}))

// ─── Teacher ──────────────────────────────────────────────────────────────────
router.get('/teacher/dashboard', asyncHandler(async (_req, res) => {
  res.json(await getTeacherDashboard())
}))

router.get('/topics', asyncHandler(async (_req, res) => {
  res.json(await getClassTopics())
}))

// ─── Notifications ────────────────────────────────────────────────────────────
router.get('/notifications', asyncHandler(async (req, res) => {
  const { userId, role } = req.query
  if (!userId || !role) return res.status(400).json({ error: 'userId and role required' })
  res.json(await getNotifications(String(userId), String(role)))
}))

router.patch('/notifications/:id/read', asyncHandler(async (req, res) => {
  const item = await markNotificationRead(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
}))

router.patch('/notifications/read-all', asyncHandler(async (req, res) => {
  const { userId, role } = req.body ?? {}
  if (!userId || !role) return res.status(400).json({ error: 'userId and role required' })
  res.json(await markAllNotificationsRead(String(userId), String(role)))
}))

// ─── Feedback ─────────────────────────────────────────────────────────────────
router.get('/feedback/:studentId', asyncHandler(async (req, res) => {
  res.json(await getFeedbackForStudent(req.params.studentId))
}))

router.post('/feedback', asyncHandler(async (req, res) => {
  const { studentId, teacherId, teacherName, message, type } = req.body ?? {}
  if (!studentId || !message) return res.status(400).json({ error: 'studentId and message required' })
  const entry = await addFeedback({
    studentId,
    teacherId: teacherId ?? 'teacher-1',
    teacherName: teacherName ?? 'Dr. Sarah Williams',
    message,
    type: type ?? 'text',
  })
  res.status(201).json(entry)
}))

// ─── Interventions ──────────────────────────────────────────────────────────────
router.post('/interventions/bulk', asyncHandler(async (req, res) => {
  const { studentIds, action } = req.body ?? {}
  if (!Array.isArray(studentIds) || !action) {
    return res.status(400).json({ error: 'studentIds and action required' })
  }
  res.json(await applyBulkIntervention(studentIds, action))
}))

router.post('/interventions/apply', asyncHandler(async (req, res) => {
  const { studentId, action, appliedBy } = req.body ?? {}
  if (!studentId || !action) return res.status(400).json({ error: 'studentId and action required' })
  const result = await applyIntervention(studentId, action, appliedBy)
  if (!result) return res.status(404).json({ error: 'Student not found' })
  res.status(201).json(result)
}))

// ─── Quiz ───────────────────────────────────────────────────────────────────────
router.get('/quizzes', asyncHandler(async (req, res) => {
  res.json(await getQuizzes(req.query.topic))
}))

router.get('/quizzes/:id', asyncHandler(async (req, res) => {
  const quiz = await getQuizById(req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  res.json(quiz)
}))

router.post('/quiz/feedback', asyncHandler(async (req, res) => {
  const { studentId, ...payload } = req.body ?? {}
  if (!studentId) return res.status(400).json({ error: 'studentId required' })
  res.json(await submitQuizFeedback(studentId, payload))
}))

router.post('/quizzes/:id/attempts', asyncHandler(async (req, res) => {
  const { studentId, answers, timeSpent } = req.body ?? {}
  if (!studentId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'studentId and answers required' })
  }
  const attempt = await submitQuizAttempt(studentId, req.params.id, answers, timeSpent)
  if (!attempt) return res.status(404).json({ error: 'Quiz not found' })
  res.status(201).json(attempt)
}))

// ─── Notes ──────────────────────────────────────────────────────────────────────
router.get('/students/:id/notes', asyncHandler(async (req, res) => {
  res.json(await getNotes(req.params.id))
}))

router.post('/students/:id/notes', asyncHandler(async (req, res) => {
  const note = await createNote(req.params.id, req.body ?? {})
  res.status(201).json(note)
}))

router.patch('/notes/:id', asyncHandler(async (req, res) => {
  const note = await updateNote(req.params.id, req.body ?? {})
  if (!note) return res.status(404).json({ error: 'Note not found' })
  res.json(note)
}))

router.delete('/notes/:id', asyncHandler(async (req, res) => {
  res.json(await deleteNote(req.params.id))
}))

// ─── Flashcards ─────────────────────────────────────────────────────────────────
router.get('/students/:id/flashcards', asyncHandler(async (req, res) => {
  res.json(await getFlashcardDeck(req.params.id))
}))

router.post('/students/:id/flashcards/review', asyncHandler(async (req, res) => {
  const { cardId, difficulty } = req.body ?? {}
  if (!cardId) return res.status(400).json({ error: 'cardId required' })
  res.json(await reviewFlashcard(req.params.id, cardId, difficulty ?? 'medium'))
}))

// ─── Study plan ─────────────────────────────────────────────────────────────────
router.get('/students/:id/study-plan', asyncHandler(async (req, res) => {
  res.json(await getStudyPlan(req.params.id))
}))

router.patch('/students/:id/study-plan/tasks', asyncHandler(async (req, res) => {
  const { day, taskIndex, status } = req.body ?? {}
  if (!day || taskIndex === undefined || !status) {
    return res.status(400).json({ error: 'day, taskIndex, and status required' })
  }
  const plan = await updateStudyTask(req.params.id, day, taskIndex, status)
  if (!plan) return res.status(404).json({ error: 'Plan or task not found' })
  res.json(plan)
}))

// ─── Focus room ─────────────────────────────────────────────────────────────────
router.get('/students/:id/focus-sessions', asyncHandler(async (req, res) => {
  res.json(await getFocusSessions(req.params.id))
}))

router.post('/students/:id/focus-sessions', asyncHandler(async (req, res) => {
  const { mode, durationMinutes } = req.body ?? {}
  if (!mode || !durationMinutes) {
    return res.status(400).json({ error: 'mode and durationMinutes required' })
  }
  res.status(201).json(await recordFocusSession(req.params.id, { mode, durationMinutes }))
}))

// ─── AI Tutor ───────────────────────────────────────────────────────────────────
router.get('/students/:id/tutor/messages', asyncHandler(async (req, res) => {
  res.json(await getTutorMessages(req.params.id))
}))

router.post('/students/:id/tutor/messages', asyncHandler(async (req, res) => {
  const { content } = req.body ?? {}
  if (!content) return res.status(400).json({ error: 'content required' })
  res.status(201).json(await sendTutorMessage(req.params.id, content))
}))

export default router
