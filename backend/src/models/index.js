import mongoose from 'mongoose'

const gapSchema = new mongoose.Schema(
  {
    topic: String,
    severity: { type: String, enum: ['green', 'amber', 'red'] },
    confidence: Number,
    accuracy: Number,
    trend: { type: String, enum: ['improving', 'stagnant', 'widening'] },
    timeOnTopicHours: Number,
    notesEngagement: Number,
    quizScore: Number,
    recommendedAction: String,
    closureBefore: Number,
    closureAfter: Number,
    peerPercentile: Number,
  },
  { _id: false }
)

export const User = mongoose.model(
  'User',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    email: String,
    role: { type: String, enum: ['student', 'teacher'] },
    className: String,
  })
)

export const Student = mongoose.model(
  'Student',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    email: String,
    urgencyScore: Number,
    overallGapScore: Number,
    streak: Number,
    lastActive: String,
    topicsNeedingAttention: Number,
    gaps: [gapSchema],
    interventions: [String],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  })
)

export const Topic = mongoose.model(
  'Topic',
  new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    className: String,
  })
)

export const Notification = mongoose.model(
  'Notification',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    role: String,
    type: String,
    urgency: Number,
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    timestamp: String,
  })
)

export const Feedback = mongoose.model(
  'Feedback',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    teacherId: String,
    teacherName: String,
    type: String,
    message: String,
    createdAt: Date,
  })
)

export const Intervention = mongoose.model(
  'Intervention',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    action: String,
    status: { type: String, enum: ['pending', 'applied', 'completed'], default: 'pending' },
    appliedBy: String,
    createdAt: Date,
  })
)

const quizQuestionSchema = new mongoose.Schema(
  {
    id: Number,
    question: String,
    type: String,
    options: [String],
    correct: Number,
    explanation: String,
  },
  { _id: false }
)

export const Quiz = mongoose.model(
  'Quiz',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    topic: String,
    questions: [quizQuestionSchema],
  })
)

export const QuizAttempt = mongoose.model(
  'QuizAttempt',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    quizId: String,
    answers: [Number],
    score: Number,
    insights: [{ type: { type: String }, message: String }],
    completedAt: Date,
  })
)

export const Note = mongoose.model(
  'Note',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    title: String,
    topic: String,
    content: String,
    preview: String,
    keyPoints: [String],
    status: String,
    shallowFlag: { type: Boolean, default: false },
    createdAt: Date,
    updatedAt: Date,
  })
)

const flashcardSchema = new mongoose.Schema(
  {
    id: Number,
    front: String,
    back: String,
    difficulty: String,
  },
  { _id: false }
)

export const FlashcardDeck = mongoose.model(
  'FlashcardDeck',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    topic: String,
    cards: [flashcardSchema],
  })
)

const studyTaskSchema = new mongoose.Schema(
  {
    title: String,
    duration: String,
    status: String,
    xp: Number,
  },
  { _id: false }
)

const studyDaySchema = new mongoose.Schema(
  {
    day: String,
    tasks: [studyTaskSchema],
  },
  { _id: false }
)

export const StudyPlan = mongoose.model(
  'StudyPlan',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    weekSchedule: [studyDaySchema],
    stats: {
      weekXp: Number,
      studyTime: String,
      tasksCompleted: Number,
      totalTasks: Number,
    },
  })
)

export const FocusSession = mongoose.model(
  'FocusSession',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    mode: { type: String, enum: ['work', 'break'] },
    durationMinutes: Number,
    completedAt: Date,
  })
)

export const Analytics = mongoose.model(
  'Analytics',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    totalXp: Number,
    totalStudyHours: Number,
    avgSessionMinutes: Number,
    badgesEarned: Number,
    xpByWeek: [{ week: String, xp: Number }],
    timeByDay: [{ day: String, hours: Number }],
    topicPerformance: [{ topic: String, mastery: Number, confidence: Number }],
    scatterData: [{ x: Number, y: Number, name: String }],
    heatmap: [{ week: Number, day: String, count: Number }],
  })
)

export const TutorMessage = mongoose.model(
  'TutorMessage',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    studentId: String,
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    createdAt: Date,
  })
)
