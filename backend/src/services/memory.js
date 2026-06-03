import { v4 as uuidv4 } from 'uuid'
import {
  CLASS_TOPICS,
  DEMO_USERS,
  INITIAL_STUDENTS,
  buildInitialNotifications,
  buildInitialFeedback,
  buildInitialInterventions,
  INITIAL_QUIZ,
  buildInitialNotes,
  buildInitialFlashcards,
  buildInitialStudyPlan,
  buildInitialAnalytics,
  buildInitialTutorMessages,
  buildStudentDashboardExtras,
} from '../data/seed.js'

let users = []
let students = []
let topics = []
let notifications = []
let feedback = []
let interventions = []
let quizzes = []
let quizAttempts = []
let notes = []
let flashcardDecks = []
let studyPlans = []
let focusSessions = []
let analytics = []
let tutorMessages = []

export function initMemoryStore() {
  users = [DEMO_USERS.student, DEMO_USERS.teacher]
  students = structuredClone(INITIAL_STUDENTS).map((s) => ({
    ...s,
    xp: s.id === 'student-1' ? 6170 : 1500,
    level: s.id === 'student-1' ? 6 : 3,
  }))
  topics = [...CLASS_TOPICS]
  notifications = buildInitialNotifications()
  feedback = buildInitialFeedback().map((f) => ({
    ...f,
    createdAt: f.createdAt instanceof Date ? f.createdAt : new Date(f.createdAt),
  }))
  interventions = buildInitialInterventions()
  quizzes = [structuredClone(INITIAL_QUIZ)]
  quizAttempts = []
  notes = buildInitialNotes('student-1')
  flashcardDecks = [buildInitialFlashcards('student-1')]
  studyPlans = [buildInitialStudyPlan('student-1')]
  focusSessions = []
  analytics = [buildInitialAnalytics('student-1')]
  tutorMessages = buildInitialTutorMessages('student-1')
  console.log('[Learnify Backend] In-memory store initialized (13 collections)')
}

function getClassGapMatrix() {
  return students.map((student) => {
    const topicMap = {}
    for (const topic of topics) {
      const gap = student.gaps.find((g) => g.topic === topic)
      topicMap[topic] = gap?.severity ?? 'green'
    }
    return { studentId: student.id, studentName: student.name, topics: topicMap }
  })
}

function getTopicWeaknessClusters() {
  const counts = {}
  for (const topic of topics) counts[topic] = { red: 0, amber: 0, students: [] }
  for (const student of students) {
    for (const gap of student.gaps) {
      if (gap.severity === 'red' || gap.severity === 'amber') {
        const bucket = counts[gap.topic]
        if (!bucket) continue
        if (gap.severity === 'red') bucket.red++
        else bucket.amber++
        if (!bucket.students.includes(student.name)) bucket.students.push(student.name)
      }
    }
  }
  return Object.entries(counts)
    .map(([topic, data]) => ({ topic, ...data, total: data.red + data.amber }))
    .filter((t) => t.total > 0)
    .sort((a, b) => b.red * 2 + b.amber - (a.red * 2 + a.amber))
}

function pushNotification(data) {
  notifications.unshift({ id: uuidv4(), read: false, timestamp: 'Just now', ...data })
}

const TUTOR_RESPONSES = {
  derivative: "A derivative measures instantaneous rate of change. Notation: f'(x). Power rule: d/dx(xⁿ)=n·xⁿ⁻¹.",
  algebra: 'Algebra gaps often come from weak fundamentals. Focus on variable isolation, factoring, and equation balancing.',
  gap: 'Prioritize red-severity topics first. Review notes deeply and take timed quizzes.',
  default: "I can help with Algebra, Fractions, Statistics, Trigonometry, Geometry, and Newton's Laws.",
}

function generateTutorReply(message) {
  const lower = message.toLowerCase()
  if (lower.includes('derivative') || lower.includes('calculus')) return TUTOR_RESPONSES.derivative
  if (lower.includes('algebra')) return TUTOR_RESPONSES.algebra
  if (lower.includes('gap') || lower.includes('weak')) return TUTOR_RESPONSES.gap
  return TUTOR_RESPONSES.default
}

export async function getDemoUser(role) {
  return users.find((u) => u.role === role) ?? DEMO_USERS[role] ?? null
}

export async function getClassTopics() {
  return topics
}

export async function getAllStudents() {
  return students
}

export async function getStudentById(id) {
  return students.find((s) => s.id === id) ?? null
}

export async function getStudentGapReport(studentId) {
  const student = students.find((s) => s.id === studentId)
  if (!student) return null
  const criticalCount = student.gaps.filter((g) => g.severity === 'red').length
  const scatterData = student.gaps.map((g) => ({ x: g.confidence, y: g.accuracy, name: g.topic }))
  const peerComparisons = student.gaps
    .filter((g) => g.peerPercentile <= 40)
    .map((g) => ({
      topic: g.topic,
      percentile: g.peerPercentile,
      message: `You're in the bottom ${g.peerPercentile}% on ${g.topic}.`,
      topPerformerStudy: 'Flashcard drills + 2 practice quizzes per week',
    }))
  const closureProgress = student.gaps.map((g) => ({
    topic: g.topic,
    before: g.closureBefore ?? g.accuracy - 10,
    after: g.closureAfter ?? g.accuracy,
    trend: g.trend,
  }))
  const notesFlags = student.gaps
    .filter((g) => g.notesEngagement < 30)
    .map((g) => ({
      topic: g.topic,
      message: `Shallow understanding flagged on ${g.topic} (${g.notesEngagement}% engagement).`,
    }))
  const streakNudge =
    student.streak === 0
      ? { message: `You skipped study — gap score ${student.overallGapScore}.`, urgency: student.urgencyScore }
      : student.gaps.some((g) => g.trend === 'widening')
        ? { message: `Gap widening on ${student.gaps.find((g) => g.trend === 'widening')?.topic}.`, urgency: 70 }
        : null

  return {
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      streak: student.streak,
      topicsNeedingAttention: student.topicsNeedingAttention,
      overallGapScore: student.overallGapScore,
    },
    summary: { criticalCount, alertMessage: `You have ${student.topicsNeedingAttention} topics needing attention this week` },
    gaps: student.gaps,
    scatterData,
    peerComparisons,
    closureProgress,
    notesFlags,
    streakNudge,
    learningPath: student.gaps
      .filter((g) => g.severity !== 'green')
      .map((g, i) => ({ step: i + 1, topic: g.topic, action: g.recommendedAction, hours: `${4 + i * 2}h` })),
  }
}

export async function getStudentDashboard(studentId) {
  const report = await getStudentGapReport(studentId)
  if (!report) return null
  const a = analytics.find((x) => x.studentId === studentId)
  const extras = buildStudentDashboardExtras(studentId)
  const student = students.find((s) => s.id === studentId)
  return {
    alertMessage: report.summary.alertMessage,
    topics: report.gaps.slice(0, 4).map((g) => ({
      title: g.topic,
      description: g.recommendedAction,
      status: g.severity === 'red' ? 'critical' : g.severity === 'amber' ? 'needs-review' : 'on-track',
      progress: g.accuracy,
      xp: g.severity === 'green' ? 200 : g.severity === 'amber' ? 100 : 0,
    })),
    streak: extras.streak,
    xp: a?.totalXp ?? student?.xp ?? extras.xp,
    level: student?.level ?? extras.level,
    masteryPercent: extras.masteryPercent,
    heatmap: a?.heatmap ?? extras.heatmap,
    stats: extras.stats,
  }
}

export async function getTeacherDashboard() {
  const clusters = getTopicWeaknessClusters()
  const atRiskCount = students.filter((s) => s.urgencyScore >= 70).length
  const pendingInterventions = interventions.filter((i) => i.status === 'pending').length
  return {
    totalStudents: students.length,
    atRiskCount,
    avgGapScore: Math.round(students.reduce((s, x) => s + x.overallGapScore, 0) / students.length),
    pendingInterventions,
    students,
    heatmap: getClassGapMatrix(),
    clusters,
    digest: {
      criticalCount: atRiskCount,
      totalGaps: students.reduce((s, x) => s + x.topicsNeedingAttention, 0),
      topCluster: clusters[0]?.topic ?? 'None',
      pendingBulk: pendingInterventions,
    },
  }
}

export async function getNotifications(userId, role) {
  return notifications.filter((n) => n.userId === userId && n.role === role).sort((a, b) => b.urgency - a.urgency)
}

export async function markNotificationRead(id) {
  const item = notifications.find((n) => n.id === id)
  if (item) item.read = true
  return item ?? null
}

export async function markAllNotificationsRead(userId, role) {
  notifications.forEach((n) => {
    if (n.userId === userId && n.role === role) n.read = true
  })
  return getNotifications(userId, role)
}

export async function getFeedbackForStudent(studentId) {
  return feedback
    .filter((f) => f.studentId === studentId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((f) => ({ ...f, createdAt: f.createdAt.toISOString?.() ?? f.createdAt }))
}

export async function addFeedback({ studentId, teacherId, teacherName, message, type = 'text' }) {
  const entry = { id: uuidv4(), studentId, teacherId, teacherName, type, message, createdAt: new Date() }
  feedback.push(entry)
  pushNotification({
    userId: studentId,
    role: 'student',
    type: 'feedback',
    urgency: 80,
    title: 'Teacher feedback on your gap card',
    message: message.slice(0, 120),
  })
  return { ...entry, createdAt: entry.createdAt.toISOString() }
}

export async function applyBulkIntervention(studentIds, action) {
  let count = 0
  for (const id of studentIds) {
    const student = students.find((s) => s.id === id)
    if (!student) continue
    if (!student.interventions.includes(action)) {
      student.interventions.push(action)
      interventions.push({ id: uuidv4(), studentId: id, action, status: 'applied', appliedBy: 'teacher-1', createdAt: new Date() })
      count++
    }
  }
  return { count, action }
}

export async function applyIntervention(studentId, action, appliedBy = 'teacher-1') {
  const student = students.find((s) => s.id === studentId)
  if (!student) return null
  if (!student.interventions.includes(action)) student.interventions.push(action)
  const entry = { id: uuidv4(), studentId, action, status: 'applied', appliedBy, createdAt: new Date() }
  interventions.push(entry)
  return entry
}

export async function getInterventionsForStudent(studentId) {
  return interventions.filter((i) => i.studentId === studentId)
}

export async function getQuizzes(topic) {
  if (!topic) return quizzes
  return quizzes.filter((q) => q.topic.toLowerCase().includes(topic.toLowerCase()))
}

export async function getQuizById(id) {
  return quizzes.find((q) => q.id === id) ?? null
}

export async function submitQuizFeedback(studentId, payload) {
  const { correct, timeMultiplier, topic, shallowNotes } = payload
  const insights = []
  if (correct && timeMultiplier >= 3) {
    insights.push({ type: 'timing', message: `Correct but ${timeMultiplier}× slower on ${topic} — review fundamentals.` })
  }
  if (!correct) {
    insights.push({ type: 'accuracy', message: `Incorrect on ${topic}. Gap severity may increase.` })
    pushNotification({ userId: studentId, role: 'student', type: 'gap', urgency: 75, title: 'Post-quiz gap alert', message: insights[0].message })
  }
  if (shallowNotes) insights.push({ type: 'notes', message: `Shallow notes detected on ${topic}.` })
  return { insights }
}

export async function submitQuizAttempt(studentId, quizId, answers, timeSpent = []) {
  const quiz = quizzes.find((q) => q.id === quizId)
  if (!quiz) return null
  const allInsights = []
  let correctCount = 0
  for (let idx = 0; idx < quiz.questions.length; idx++) {
    const answer = answers[idx]
    if (answer == null) continue
    const correct = answer === quiz.questions[idx].correct
    if (correct) correctCount++
    const { insights } = await submitQuizFeedback(studentId, {
      correct,
      timeMultiplier: Math.max(1, Math.round((timeSpent[idx] || 15) / 15)),
      topic: quiz.topic,
      shallowNotes: idx === 2 && !correct,
    })
    allInsights.push(...insights)
  }
  const attempt = { id: uuidv4(), studentId, quizId, answers, score: Math.round((correctCount / quiz.questions.length) * 100), insights: allInsights, completedAt: new Date() }
  quizAttempts.push(attempt)
  return { ...attempt, completedAt: attempt.completedAt.toISOString() }
}

export async function getNotes(studentId) {
  return notes.filter((n) => n.studentId === studentId)
}

export async function createNote(studentId, data) {
  const shallowFlag = (data.content?.length ?? 0) < 80
  const entry = {
    id: uuidv4(),
    studentId,
    title: data.title,
    topic: data.topic,
    content: data.content ?? '',
    preview: (data.content ?? '').slice(0, 80),
    keyPoints: data.keyPoints ?? [],
    status: 'in-progress',
    shallowFlag,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  notes.push(entry)
  return entry
}

export async function updateNote(noteId, data) {
  const note = notes.find((n) => n.id === noteId)
  if (!note) return null
  Object.assign(note, data, { updatedAt: new Date() })
  return note
}

export async function deleteNote(noteId) {
  notes = notes.filter((n) => n.id !== noteId)
  return { ok: true }
}

export async function getFlashcardDeck(studentId) {
  return flashcardDecks.find((d) => d.studentId === studentId) ?? buildInitialFlashcards(studentId)
}

export async function reviewFlashcard(studentId, cardId, difficulty) {
  const deck = flashcardDecks.find((d) => d.studentId === studentId)
  if (deck) {
    const card = deck.cards.find((c) => c.id === cardId)
    if (card) card.difficulty = difficulty
  }
  return { cardId, difficulty }
}

export async function getStudyPlan(studentId) {
  return studyPlans.find((p) => p.studentId === studentId) ?? buildInitialStudyPlan(studentId)
}

export async function updateStudyTask(studentId, day, taskIndex, status) {
  const plan = studyPlans.find((p) => p.studentId === studentId)
  if (!plan) return null
  const dayPlan = plan.weekSchedule.find((d) => d.day === day)
  if (!dayPlan?.tasks[taskIndex]) return null
  dayPlan.tasks[taskIndex].status = status
  if (status === 'completed') plan.stats.tasksCompleted++
  return plan
}

export async function getFocusSessions(studentId) {
  return focusSessions.filter((s) => s.studentId === studentId)
}

export async function recordFocusSession(studentId, { mode, durationMinutes }) {
  const entry = { id: uuidv4(), studentId, mode, durationMinutes, completedAt: new Date() }
  focusSessions.push(entry)
  const student = students.find((s) => s.id === studentId)
  if (student && mode === 'work') {
    student.streak = Math.max(student.streak, 1)
    student.xp = (student.xp ?? 0) + durationMinutes * 2
  }
  return { ...entry, completedAt: entry.completedAt.toISOString(), sessionsCompleted: focusSessions.filter((s) => s.studentId === studentId && s.mode === 'work').length }
}

export async function getAnalytics(studentId) {
  return analytics.find((a) => a.studentId === studentId) ?? buildInitialAnalytics(studentId)
}

export async function getTutorMessages(studentId) {
  return tutorMessages.filter((m) => m.studentId === studentId)
}

export async function sendTutorMessage(studentId, content) {
  const userMsg = { id: uuidv4(), studentId, role: 'user', content, createdAt: new Date() }
  const assistantMsg = { id: uuidv4(), studentId, role: 'assistant', content: generateTutorReply(content), createdAt: new Date() }
  tutorMessages.push(userMsg, assistantMsg)
  return {
    user: { ...userMsg, createdAt: userMsg.createdAt.toISOString() },
    assistant: { ...assistantMsg, createdAt: assistantMsg.createdAt.toISOString() },
  }
}

export async function listMemoryCollections() {
  return ['users', 'students', 'topics', 'notifications', 'feedback', 'interventions', 'quizzes', 'quiz_attempts', 'notes', 'flashcard_decks', 'study_plans', 'focus_sessions', 'analytics', 'tutor_messages']
}
