import { v4 as uuidv4 } from 'uuid'
import {
  User,
  Student,
  Topic,
  Notification,
  Feedback,
  Intervention,
  Quiz,
  QuizAttempt,
  Note,
  FlashcardDeck,
  StudyPlan,
  FocusSession,
  Analytics,
  TutorMessage,
} from '../models/index.js'
import { DEMO_USERS, buildStudentDashboardExtras } from '../data/seed.js'

function lean(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  delete o._id
  delete o.__v
  return o
}

function leanList(docs) {
  return docs.map(lean)
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function getDemoUser(role) {
  const user = await User.findOne({ role }).lean()
  return user ? lean(user) : DEMO_USERS[role] ?? null
}

// ─── Topics ─────────────────────────────────────────────────────────────────

export async function getClassTopics() {
  const topics = await Topic.find().lean()
  return topics.length ? topics.map((t) => t.name) : []
}

// ─── Students ───────────────────────────────────────────────────────────────

export async function getAllStudents() {
  return leanList(await Student.find().lean())
}

export async function getStudentById(id) {
  return lean(await Student.findOne({ id }).lean())
}

async function getClassGapMatrix() {
  const students = await Student.find().lean()
  const topics = await getClassTopics()
  return students.map((student) => {
    const topicMap = {}
    for (const topic of topics) {
      const gap = student.gaps.find((g) => g.topic === topic)
      topicMap[topic] = gap?.severity ?? 'green'
    }
    return { studentId: student.id, studentName: student.name, topics: topicMap }
  })
}

async function getTopicWeaknessClusters() {
  const students = await Student.find().lean()
  const topics = await getClassTopics()
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

export async function getStudentGapReport(studentId) {
  const student = await Student.findOne({ id: studentId }).lean()
  if (!student) return null

  const criticalCount = student.gaps.filter((g) => g.severity === 'red').length
  const scatterData = student.gaps.map((g) => ({ x: g.confidence, y: g.accuracy, name: g.topic }))

  const peerComparisons = student.gaps
    .filter((g) => g.peerPercentile <= 40)
    .map((g) => ({
      topic: g.topic,
      percentile: g.peerPercentile,
      message: `You're in the bottom ${g.peerPercentile}% on ${g.topic} — top performers averaged ${Math.min(g.accuracy + 35, 95)}% accuracy with ${Math.max(g.notesEngagement + 30, 70)}+ notes engagement.`,
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
      message: `Shallow understanding flagged: You haven't engaged with ${g.topic} beyond surface notes (${g.notesEngagement}% engagement).`,
    }))

  const streakNudge =
    student.streak === 0
      ? { message: `You skipped study for ${student.lastActive} — your gap score rose to ${student.overallGapScore}.`, urgency: student.urgencyScore }
      : student.gaps.some((g) => g.trend === 'widening')
        ? { message: `Gap widening detected on ${student.gaps.find((g) => g.trend === 'widening')?.topic} — review recommended within 48 hours.`, urgency: 70 }
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
    summary: {
      criticalCount,
      alertMessage: `You have ${student.topicsNeedingAttention} topics needing attention this week`,
    },
    gaps: student.gaps,
    scatterData,
    peerComparisons,
    closureProgress,
    notesFlags,
    streakNudge,
    learningPath: student.gaps
      .filter((g) => g.severity !== 'green')
      .sort((a, b) => (a.severity === 'red' ? -1 : 1))
      .map((g, i) => ({
        step: i + 1,
        topic: g.topic,
        action: g.recommendedAction,
        hours: `${4 + i * 2}-${6 + i * 2} hours`,
      })),
  }
}

export async function getStudentDashboard(studentId) {
  const [report, analytics, extras] = await Promise.all([
    getStudentGapReport(studentId),
    Analytics.findOne({ studentId }).lean(),
    Promise.resolve(buildStudentDashboardExtras(studentId)),
  ])
  if (!report) return null
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
    xp: analytics?.totalXp ?? extras.xp,
    level: report.student.id === studentId ? (await Student.findOne({ id: studentId }).lean())?.level ?? extras.level : extras.level,
    masteryPercent: extras.masteryPercent,
    heatmap: analytics?.heatmap ?? extras.heatmap,
    stats: extras.stats,
  }
}

// ─── Teacher ──────────────────────────────────────────────────────────────────

export async function getTeacherDashboard() {
  const students = await Student.find().lean()
  const clusters = await getTopicWeaknessClusters()
  const atRiskCount = students.filter((s) => s.urgencyScore >= 70).length
  const avgGap = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.overallGapScore, 0) / students.length)
    : 0
  const pendingInterventions = await Intervention.countDocuments({ status: 'pending' })

  return {
    totalStudents: students.length,
    atRiskCount,
    avgGapScore: avgGap,
    pendingInterventions,
    students: leanList(students),
    heatmap: await getClassGapMatrix(),
    clusters,
    digest: {
      criticalCount: atRiskCount,
      totalGaps: students.reduce((sum, s) => sum + s.topicsNeedingAttention, 0),
      topCluster: clusters[0]?.topic ?? 'None',
      pendingBulk: pendingInterventions,
    },
  }
}

// ─── Notifications ──────────────────────────────────────────────────────────

export async function getNotifications(userId, role) {
  return leanList(
    await Notification.find({ userId, role }).sort({ urgency: -1 }).lean()
  )
}

export async function markNotificationRead(id) {
  const item = await Notification.findOneAndUpdate({ id }, { read: true }, { new: true }).lean()
  return lean(item)
}

export async function markAllNotificationsRead(userId, role) {
  await Notification.updateMany({ userId, role, read: false }, { read: true })
  return getNotifications(userId, role)
}

async function pushNotification(data) {
  const entry = { id: uuidv4(), read: false, timestamp: 'Just now', ...data }
  await Notification.create(entry)
  return entry
}

// ─── Feedback ───────────────────────────────────────────────────────────────

export async function getFeedbackForStudent(studentId) {
  const items = await Feedback.find({ studentId }).sort({ createdAt: -1 }).lean()
  return items.map((f) => ({ ...lean(f), createdAt: f.createdAt?.toISOString?.() ?? f.createdAt }))
}

export async function addFeedback({ studentId, teacherId, teacherName, message, type = 'text' }) {
  const entry = {
    id: uuidv4(),
    studentId,
    teacherId,
    teacherName,
    type,
    message,
    createdAt: new Date(),
  }
  await Feedback.create(entry)
  await pushNotification({
    userId: studentId,
    role: 'student',
    type: 'feedback',
    urgency: 80,
    title: 'Teacher feedback on your gap card',
    message: message.slice(0, 120) + (message.length > 120 ? '…' : ''),
  })
  return { ...entry, createdAt: entry.createdAt.toISOString() }
}

// ─── Interventions ────────────────────────────────────────────────────────────

export async function applyBulkIntervention(studentIds, action) {
  let count = 0
  for (const id of studentIds) {
    const student = await Student.findOne({ id })
    if (!student) continue
    if (!student.interventions.includes(action)) {
      student.interventions.push(action)
      await student.save()
      await Intervention.create({
        id: uuidv4(),
        studentId: id,
        action,
        status: 'applied',
        appliedBy: 'teacher-1',
        createdAt: new Date(),
      })
      count++
    }
  }
  return { count, action }
}

export async function applyIntervention(studentId, action, appliedBy = 'teacher-1') {
  const student = await Student.findOne({ id: studentId })
  if (!student) return null
  if (!student.interventions.includes(action)) {
    student.interventions.push(action)
    await student.save()
  }
  const entry = await Intervention.create({
    id: uuidv4(),
    studentId,
    action,
    status: 'applied',
    appliedBy,
    createdAt: new Date(),
  })
  return lean(entry)
}

export async function getInterventionsForStudent(studentId) {
  return leanList(await Intervention.find({ studentId }).sort({ createdAt: -1 }).lean())
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export async function getQuizzes(topic) {
  const filter = topic ? { topic: new RegExp(topic, 'i') } : {}
  return leanList(await Quiz.find(filter).lean())
}

export async function getQuizById(id) {
  return lean(await Quiz.findOne({ id }).lean())
}

export async function submitQuizFeedback(studentId, payload) {
  const { correct, timeMultiplier, topic, shallowNotes } = payload
  const insights = []

  if (correct && timeMultiplier >= 3) {
    insights.push({
      type: 'timing',
      message: `You got the answer right but took ${timeMultiplier}× longer than average — review ${topic} concept fundamentals.`,
    })
  }
  if (!correct) {
    insights.push({
      type: 'accuracy',
      message: `Incorrect on ${topic}. Gap severity may increase — recommended review assigned.`,
    })
    const student = await Student.findOne({ id: studentId })
    if (student) {
      const gap = student.gaps.find((g) => g.topic.toLowerCase().includes(topic.toLowerCase().split(' ')[0]) || topic.toLowerCase().includes(g.topic.toLowerCase()))
      if (gap && gap.severity !== 'red') {
        gap.severity = gap.severity === 'amber' ? 'red' : 'amber'
        gap.accuracy = Math.max(0, gap.accuracy - 5)
        gap.trend = 'widening'
        student.topicsNeedingAttention = student.gaps.filter((g) => g.severity !== 'green').length
        student.overallGapScore = Math.min(100, student.overallGapScore + 3)
        await student.save()
      }
    }
    await pushNotification({
      userId: studentId,
      role: 'student',
      type: 'gap',
      urgency: 75,
      title: 'Post-quiz gap alert',
      message: insights[0]?.message ?? 'Review recommended after quiz performance.',
    })
  }
  if (shallowNotes) {
    insights.push({
      type: 'notes',
      message: `Notes flag: shallow understanding detected on ${topic} — go beyond surface summaries.`,
    })
  }
  return { insights }
}

export async function submitQuizAttempt(studentId, quizId, answers, timeSpent = []) {
  const quiz = await Quiz.findOne({ id: quizId }).lean()
  if (!quiz) return null

  const allInsights = []
  let correctCount = 0
  const AVG_SECONDS = 15

  for (let idx = 0; idx < quiz.questions.length; idx++) {
    const q = quiz.questions[idx]
    const answer = answers[idx]
    if (answer === null || answer === undefined) continue
    const correct = answer === q.correct
    if (correct) correctCount++
    const seconds = timeSpent[idx] || AVG_SECONDS
    const timeMultiplier = Math.max(1, Math.round(seconds / AVG_SECONDS))
    const { insights } = await submitQuizFeedback(studentId, {
      correct,
      timeMultiplier,
      topic: quiz.topic,
      shallowNotes: idx === 2 && !correct,
    })
    allInsights.push(...insights)
  }

  const score = Math.round((correctCount / quiz.questions.length) * 100)
  const attempt = {
    id: uuidv4(),
    studentId,
    quizId,
    answers,
    score,
    insights: allInsights,
    completedAt: new Date(),
  }
  await QuizAttempt.create(attempt)
  return { ...attempt, completedAt: attempt.completedAt.toISOString() }
}

// ─── Notes ──────────────────────────────────────────────────────────────────

export async function getNotes(studentId) {
  const notes = await Note.find({ studentId }).sort({ updatedAt: -1 }).lean()
  return notes.map((n) => ({
    ...lean(n),
    createdAt: n.createdAt?.toISOString?.(),
    updatedAt: n.updatedAt?.toISOString?.(),
  }))
}

export async function createNote(studentId, data) {
  const shallowFlag = (data.content?.length ?? 0) < 80
  const entry = {
    id: uuidv4(),
    studentId,
    title: data.title,
    topic: data.topic,
    content: data.content ?? '',
    preview: (data.content ?? '').slice(0, 80) + '...',
    keyPoints: data.keyPoints ?? [],
    status: 'in-progress',
    shallowFlag,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await Note.create(entry)
  if (shallowFlag) {
    await pushNotification({
      userId: studentId,
      role: 'student',
      type: 'notes',
      urgency: 65,
      title: 'Shallow notes detected',
      message: `Your note on ${data.topic} looks surface-level — add more detail.`,
    })
  }
  return { ...entry, createdAt: entry.createdAt.toISOString(), updatedAt: entry.updatedAt.toISOString() }
}

export async function updateNote(noteId, data) {
  const shallowFlag = data.content ? data.content.length < 80 : undefined
  const update = { ...data, updatedAt: new Date() }
  if (shallowFlag !== undefined) update.shallowFlag = shallowFlag
  const note = await Note.findOneAndUpdate({ id: noteId }, update, { new: true }).lean()
  return lean(note)
}

export async function deleteNote(noteId) {
  await Note.deleteOne({ id: noteId })
  return { ok: true }
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export async function getFlashcardDeck(studentId) {
  let deck = await FlashcardDeck.findOne({ studentId }).lean()
  if (!deck) {
    const { buildInitialFlashcards } = await import('../data/seed.js')
    deck = buildInitialFlashcards(studentId)
    await FlashcardDeck.create(deck)
  }
  return lean(deck)
}

export async function reviewFlashcard(studentId, cardId, difficulty) {
  const deck = await FlashcardDeck.findOne({ studentId })
  if (!deck) return null
  const card = deck.cards.find((c) => c.id === cardId)
  if (card) card.difficulty = difficulty
  await deck.save()
  return { cardId, difficulty }
}

// ─── Study plan ───────────────────────────────────────────────────────────────

export async function getStudyPlan(studentId) {
  let plan = await StudyPlan.findOne({ studentId }).lean()
  if (!plan) {
    const { buildInitialStudyPlan } = await import('../data/seed.js')
    plan = buildInitialStudyPlan(studentId)
    await StudyPlan.create(plan)
  }
  return lean(plan)
}

export async function updateStudyTask(studentId, day, taskIndex, status) {
  const plan = await StudyPlan.findOne({ studentId })
  if (!plan) return null
  const dayPlan = plan.weekSchedule.find((d) => d.day === day)
  if (!dayPlan || !dayPlan.tasks[taskIndex]) return null
  dayPlan.tasks[taskIndex].status = status
  if (status === 'completed') {
    plan.stats.tasksCompleted = Math.min(plan.stats.totalTasks, plan.stats.tasksCompleted + 1)
  }
  await plan.markModified('weekSchedule')
  await plan.save()
  return lean(plan)
}

// ─── Focus sessions ───────────────────────────────────────────────────────────

export async function getFocusSessions(studentId) {
  const sessions = await FocusSession.find({ studentId }).sort({ completedAt: -1 }).limit(20).lean()
  return leanList(sessions)
}

export async function recordFocusSession(studentId, { mode, durationMinutes }) {
  const entry = {
    id: uuidv4(),
    studentId,
    mode,
    durationMinutes,
    completedAt: new Date(),
  }
  await FocusSession.create(entry)
  const student = await Student.findOne({ id: studentId })
  if (student && mode === 'work') {
    student.streak = Math.max(student.streak, 1)
    student.xp = (student.xp ?? 0) + durationMinutes * 2
    await student.save()
  }
  return { ...entry, completedAt: entry.completedAt.toISOString(), sessionsCompleted: await FocusSession.countDocuments({ studentId, mode: 'work' }) }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(studentId) {
  let analytics = await Analytics.findOne({ studentId }).lean()
  if (!analytics) {
    const { buildInitialAnalytics } = await import('../data/seed.js')
    analytics = buildInitialAnalytics(studentId)
    await Analytics.create(analytics)
  }
  return lean(analytics)
}

// ─── AI Tutor ─────────────────────────────────────────────────────────────────

const TUTOR_RESPONSES = {
  derivative: "A derivative measures instantaneous rate of change. Notation: f'(x). Power rule: d/dx(xⁿ)=n·xⁿ⁻¹. Chain rule: (f∘g)'(x)=f'(g(x))·g'(x). Want a worked example?",
  algebra: 'Algebra gaps often come from weak fundamentals. Focus on: variable isolation, factoring, and equation balancing. Your gap report shows Algebra as a priority — try flashcard drills + 2 practice quizzes this week.',
  gap: 'Based on your gap profile, prioritize red-severity topics first. Review notes deeply (not just summaries), take timed quizzes, and check peer comparison benchmarks in Gap Detection.',
  default: "Great question! I can explain Math 10A topics including Algebra, Fractions, Statistics, Trigonometry, Geometry, and Newton's Laws. Ask about a specific topic or say 'explain derivatives' for a detailed walkthrough.",
}

function generateTutorReply(message) {
  const lower = message.toLowerCase()
  if (lower.includes('derivative') || lower.includes('calculus')) return TUTOR_RESPONSES.derivative
  if (lower.includes('algebra')) return TUTOR_RESPONSES.algebra
  if (lower.includes('gap') || lower.includes('weak')) return TUTOR_RESPONSES.gap
  return TUTOR_RESPONSES.default
}

export async function getTutorMessages(studentId) {
  const messages = await TutorMessage.find({ studentId }).sort({ createdAt: 1 }).lean()
  return messages.map((m) => ({
    ...lean(m),
    createdAt: m.createdAt?.toISOString?.(),
  }))
}

export async function sendTutorMessage(studentId, content) {
  const userMsg = {
    id: uuidv4(),
    studentId,
    role: 'user',
    content,
    createdAt: new Date(),
  }
  await TutorMessage.create(userMsg)

  const replyContent = generateTutorReply(content)
  const assistantMsg = {
    id: uuidv4(),
    studentId,
    role: 'assistant',
    content: replyContent,
    createdAt: new Date(),
  }
  await TutorMessage.create(assistantMsg)

  return {
    user: { ...userMsg, createdAt: userMsg.createdAt.toISOString() },
    assistant: { ...assistantMsg, createdAt: assistantMsg.createdAt.toISOString() },
  }
}
