import mongoose from 'mongoose'
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
  buildInitialFocusSessions,
  buildInitialQuizAttempts,
  buildInitialFlashcardsForStudents,
  buildInitialAnalyticsForStudents,
  buildInitialStudyPlansForStudents,
  buildInitialNotesForStudents,
  buildInitialTutorMessagesForStudents,
} from './seed.js'

const ALL_MODELS = [
  { name: 'users', Model: User },
  { name: 'students', Model: Student },
  { name: 'topics', Model: Topic },
  { name: 'notifications', Model: Notification },
  { name: 'feedbacks', Model: Feedback },
  { name: 'interventions', Model: Intervention },
  { name: 'quizzes', Model: Quiz },
  { name: 'quizattempts', Model: QuizAttempt },
  { name: 'notes', Model: Note },
  { name: 'flashcarddecks', Model: FlashcardDeck },
  { name: 'studyplans', Model: StudyPlan },
  { name: 'focussessions', Model: FocusSession },
  { name: 'analytics', Model: Analytics },
  { name: 'tutormessages', Model: TutorMessage },
]

export async function getAllDocumentCounts() {
  const counts = {}
  for (const { name, Model } of ALL_MODELS) {
    counts[name] = await Model.countDocuments()
  }
  return counts
}

async function seedFreshDatabase() {
  console.log('[Learnify Backend] Seeding all MongoDB collections...')

  await User.insertMany([DEMO_USERS.student, DEMO_USERS.teacher])

  await Student.insertMany(
    INITIAL_STUDENTS.map((s) => ({
      ...s,
      xp: s.id === 'student-1' ? 6170 : Math.floor(Math.random() * 3000 + 500),
      level: s.id === 'student-1' ? 6 : Math.floor(Math.random() * 4 + 2),
    }))
  )

  await Topic.insertMany(CLASS_TOPICS.map((name) => ({ name, className: 'Math 10A' })))
  await Notification.insertMany(buildInitialNotifications())
  await Feedback.insertMany(buildInitialFeedback())
  await Intervention.insertMany(buildInitialInterventions())
  await Quiz.create(INITIAL_QUIZ)
  await QuizAttempt.insertMany(buildInitialQuizAttempts('student-1'))
  await Note.insertMany(buildInitialNotesForStudents())
  await FlashcardDeck.insertMany(buildInitialFlashcardsForStudents())
  await StudyPlan.insertMany(buildInitialStudyPlansForStudents())
  await FocusSession.insertMany(buildInitialFocusSessions('student-1'))
  await Analytics.insertMany(buildInitialAnalyticsForStudents())
  await TutorMessage.insertMany(buildInitialTutorMessagesForStudents())

  console.log('[Learnify Backend] Full seed complete — all 14 collections populated')
  return true
}

/** Fill any collection that is still empty (safe to run on every startup) */
export async function ensureAllCollectionsPopulated() {
  let filled = 0

  if ((await User.countDocuments()) === 0) {
    await User.insertMany([DEMO_USERS.student, DEMO_USERS.teacher])
    filled++
  }
  if ((await Student.countDocuments()) === 0) {
    await Student.insertMany(
      INITIAL_STUDENTS.map((s) => ({
        ...s,
        xp: s.id === 'student-1' ? 6170 : 1500,
        level: s.id === 'student-1' ? 6 : 3,
      }))
    )
    filled++
  }
  if ((await Topic.countDocuments()) === 0) {
    await Topic.insertMany(CLASS_TOPICS.map((name) => ({ name, className: 'Math 10A' })))
    filled++
  }
  if ((await Notification.countDocuments()) === 0) {
    await Notification.insertMany(buildInitialNotifications())
    filled++
  }
  if ((await Feedback.countDocuments()) === 0) {
    await Feedback.insertMany(buildInitialFeedback())
    filled++
  }
  if ((await Intervention.countDocuments()) === 0) {
    await Intervention.insertMany(buildInitialInterventions())
    filled++
  }
  if ((await Quiz.countDocuments()) === 0) {
    await Quiz.create(INITIAL_QUIZ)
    filled++
  }
  if ((await QuizAttempt.countDocuments()) === 0) {
    await QuizAttempt.insertMany(buildInitialQuizAttempts('student-1'))
    filled++
  }
  if ((await Note.countDocuments()) === 0) {
    await Note.insertMany(buildInitialNotesForStudents())
    filled++
  }
  if ((await FlashcardDeck.countDocuments()) === 0) {
    await FlashcardDeck.insertMany(buildInitialFlashcardsForStudents())
    filled++
  }
  if ((await StudyPlan.countDocuments()) === 0) {
    await StudyPlan.insertMany(buildInitialStudyPlansForStudents())
    filled++
  }
  if ((await FocusSession.countDocuments()) === 0) {
    await FocusSession.insertMany(buildInitialFocusSessions('student-1'))
    filled++
  }
  if ((await Analytics.countDocuments()) === 0) {
    await Analytics.insertMany(buildInitialAnalyticsForStudents())
    filled++
  }
  if ((await TutorMessage.countDocuments()) === 0) {
    await TutorMessage.insertMany(buildInitialTutorMessagesForStudents())
    filled++
  }

  if (filled > 0) {
    console.log(`[Learnify Backend] Filled ${filled} empty collection(s)`)
  }
  return filled
}

export async function seedDatabase() {
  const studentCount = await Student.countDocuments()
  if (studentCount === 0) {
    await seedFreshDatabase()
    return true
  }
  await ensureAllCollectionsPopulated()
  console.log('[Learnify Backend] Database already seeded — ensured all collections have data')
  return false
}

/** Drop and reseed everything — use via npm run seed:force */
export async function forceReseedDatabase() {
  console.log('[Learnify Backend] Dropping all collections and reseeding...')
  for (const { Model } of [...ALL_MODELS].reverse()) {
    await Model.deleteMany({})
  }
  return seedFreshDatabase()
}

export async function listCollections() {
  const db = mongoose.connection.db
  if (!db) return []
  const collections = await db.listCollections().toArray()
  return collections.map((c) => c.name).sort()
}
