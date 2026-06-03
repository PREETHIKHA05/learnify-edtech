import type { GapTrend } from '@/shared/types'

export type GapSeverity = 'green' | 'amber' | 'red'

export interface StudentTopicGap {
  topic: string
  severity: GapSeverity
  confidence: number
  accuracy: number
  trend: GapTrend
  timeOnTopicHours: number
  notesEngagement: number
  quizScore: number
  recommendedAction: string
}

export interface ClassStudent {
  id: string
  name: string
  email: string
  urgencyScore: number
  overallGapScore: number
  streak: number
  lastActive: string
  topicsNeedingAttention: number
  gaps: StudentTopicGap[]
  interventions: string[]
}

export const CLASS_TOPICS = [
  'Algebra',
  'Fractions',
  "Newton's Laws",
  'Geometry',
  'Statistics',
  'Trigonometry',
] as const

export const MOCK_CLASS_STUDENTS: ClassStudent[] = [
  {
    id: 'student-1',
    name: 'Alex Chen',
    email: 'alex.chen@student.learnify.demo',
    urgencyScore: 72,
    overallGapScore: 68,
    streak: 12,
    lastActive: '2 hours ago',
    topicsNeedingAttention: 3,
    gaps: [
      {
        topic: 'Algebra',
        severity: 'red',
        confidence: 45,
        accuracy: 38,
        trend: 'widening',
        timeOnTopicHours: 2.5,
        notesEngagement: 20,
        quizScore: 35,
        recommendedAction: 'Assign flashcard drill on matrix operations',
      },
      {
        topic: 'Statistics',
        severity: 'red',
        confidence: 55,
        accuracy: 42,
        trend: 'stagnant',
        timeOnTopicHours: 1.2,
        notesEngagement: 15,
        quizScore: 40,
        recommendedAction: 'Schedule 1:1 on conditional probability',
      },
      {
        topic: 'Trigonometry',
        severity: 'amber',
        confidence: 62,
        accuracy: 58,
        trend: 'improving',
        timeOnTopicHours: 4.0,
        notesEngagement: 45,
        quizScore: 55,
        recommendedAction: 'Review unit circle with practice quiz',
      },
    ],
    interventions: [
      'Assign flashcard drill on Fractions',
      'Schedule 1:1 on Newton\'s Laws',
    ],
  },
  {
    id: 'student-2',
    name: 'Jordan Lee',
    email: 'jordan.lee@student.learnify.demo',
    urgencyScore: 91,
    overallGapScore: 82,
    streak: 2,
    lastActive: '5 days ago',
    topicsNeedingAttention: 5,
    gaps: [
      { topic: 'Algebra', severity: 'red', confidence: 30, accuracy: 28, trend: 'widening', timeOnTopicHours: 0.5, notesEngagement: 5, quizScore: 25, recommendedAction: 'Assign remedial Algebra module' },
      { topic: 'Fractions', severity: 'red', confidence: 40, accuracy: 35, trend: 'widening', timeOnTopicHours: 0.8, notesEngagement: 10, quizScore: 30, recommendedAction: 'Assign flashcard drill on Fractions' },
      { topic: "Newton's Laws", severity: 'red', confidence: 35, accuracy: 32, trend: 'stagnant', timeOnTopicHours: 1.0, notesEngagement: 8, quizScore: 28, recommendedAction: 'Schedule 1:1 on Newton\'s Laws' },
      { topic: 'Geometry', severity: 'amber', confidence: 50, accuracy: 48, trend: 'stagnant', timeOnTopicHours: 2.0, notesEngagement: 25, quizScore: 45, recommendedAction: 'Peer study group on proofs' },
      { topic: 'Statistics', severity: 'amber', confidence: 55, accuracy: 52, trend: 'improving', timeOnTopicHours: 3.0, notesEngagement: 30, quizScore: 50, recommendedAction: 'Extra practice on mean/median' },
    ],
    interventions: [
      'Assign flashcard drill on Fractions',
      'Schedule 1:1 on Newton\'s Laws',
      'Flag for weekly check-in',
    ],
  },
  {
    id: 'student-3',
    name: 'Sam Patel',
    email: 'sam.patel@student.learnify.demo',
    urgencyScore: 45,
    overallGapScore: 42,
    streak: 8,
    lastActive: '1 day ago',
    topicsNeedingAttention: 2,
    gaps: [
      { topic: 'Fractions', severity: 'amber', confidence: 58, accuracy: 55, trend: 'improving', timeOnTopicHours: 3.5, notesEngagement: 50, quizScore: 58, recommendedAction: 'Continue current practice path' },
      { topic: 'Statistics', severity: 'amber', confidence: 60, accuracy: 57, trend: 'stagnant', timeOnTopicHours: 2.8, notesEngagement: 40, quizScore: 55, recommendedAction: 'Assign statistics worksheet' },
    ],
    interventions: ['Assign statistics worksheet'],
  },
  {
    id: 'student-4',
    name: 'Riley Morgan',
    email: 'riley.morgan@student.learnify.demo',
    urgencyScore: 28,
    overallGapScore: 25,
    streak: 15,
    lastActive: '3 hours ago',
    topicsNeedingAttention: 1,
    gaps: [
      { topic: 'Trigonometry', severity: 'green', confidence: 85, accuracy: 88, trend: 'improving', timeOnTopicHours: 6.0, notesEngagement: 80, quizScore: 90, recommendedAction: 'Ready for advanced topics' },
      { topic: 'Algebra', severity: 'green', confidence: 90, accuracy: 92, trend: 'improving', timeOnTopicHours: 8.0, notesEngagement: 85, quizScore: 94, recommendedAction: 'No action needed' },
    ],
    interventions: [],
  },
  {
    id: 'student-5',
    name: 'Casey Kim',
    email: 'casey.kim@student.learnify.demo',
    urgencyScore: 78,
    overallGapScore: 71,
    streak: 0,
    lastActive: '8 days ago',
    topicsNeedingAttention: 4,
    gaps: [
      { topic: 'Algebra', severity: 'red', confidence: 42, accuracy: 38, trend: 'widening', timeOnTopicHours: 0.3, notesEngagement: 5, quizScore: 32, recommendedAction: 'Urgent: Assign Algebra basics module' },
      { topic: 'Fractions', severity: 'red', confidence: 38, accuracy: 35, trend: 'widening', timeOnTopicHours: 0.2, notesEngagement: 3, quizScore: 28, recommendedAction: 'Assign flashcard drill on Fractions' },
      { topic: 'Geometry', severity: 'amber', confidence: 48, accuracy: 45, trend: 'stagnant', timeOnTopicHours: 1.5, notesEngagement: 20, quizScore: 42, recommendedAction: 'Review angle relationships' },
      { topic: "Newton's Laws", severity: 'amber', confidence: 52, accuracy: 48, trend: 'stagnant', timeOnTopicHours: 1.0, notesEngagement: 15, quizScore: 45, recommendedAction: 'Watch concept video + quiz' },
    ],
    interventions: [
      'Assign flashcard drill on Fractions',
      'Send streak recovery nudge',
      'Schedule 1:1 check-in',
    ],
  },
  {
    id: 'student-6',
    name: 'Taylor Brooks',
    email: 'taylor.brooks@student.learnify.demo',
    urgencyScore: 55,
    overallGapScore: 50,
    streak: 6,
    lastActive: '6 hours ago',
    topicsNeedingAttention: 2,
    gaps: [
      { topic: "Newton's Laws", severity: 'amber', confidence: 55, accuracy: 50, trend: 'improving', timeOnTopicHours: 3.0, notesEngagement: 35, quizScore: 52, recommendedAction: 'Schedule 1:1 on Newton\'s Laws' },
      { topic: 'Geometry', severity: 'amber', confidence: 58, accuracy: 54, trend: 'stagnant', timeOnTopicHours: 2.5, notesEngagement: 30, quizScore: 50, recommendedAction: 'Practice proof exercises' },
    ],
    interventions: ['Schedule 1:1 on Newton\'s Laws'],
  },
]

export function getStudentById(id: string): ClassStudent | undefined {
  return MOCK_CLASS_STUDENTS.find((s) => s.id === id)
}

export function getClassGapMatrix(): { studentId: string; studentName: string; topics: Record<string, GapSeverity> }[] {
  return MOCK_CLASS_STUDENTS.map((student) => {
    const topics: Record<string, GapSeverity> = {}
    for (const topic of CLASS_TOPICS) {
      const gap = student.gaps.find((g) => g.topic === topic)
      topics[topic] = gap?.severity ?? 'green'
    }
    return { studentId: student.id, studentName: student.name, topics }
  })
}

export function getTopicWeaknessClusters() {
  const counts: Record<string, { red: number; amber: number; students: string[] }> = {}

  const ensureTopic = (topic: string) => {
    if (!counts[topic]) {
      counts[topic] = { red: 0, amber: 0, students: [] }
    }
    return counts[topic]
  }

  for (const topic of CLASS_TOPICS) {
    ensureTopic(topic)
  }

  for (const student of MOCK_CLASS_STUDENTS) {
    for (const gap of student.gaps) {
      if (gap.severity === 'red' || gap.severity === 'amber') {
        const bucket = ensureTopic(gap.topic)
        if (gap.severity === 'red') bucket.red++
        else bucket.amber++
        if (!bucket.students.includes(student.name)) {
          bucket.students.push(student.name)
        }
      }
    }
  }

  return Object.entries(counts)
    .map(([topic, data]) => ({ topic, ...data, total: data.red + data.amber }))
    .filter((t) => t.total > 0)
    .sort((a, b) => b.red * 2 + b.amber - (a.red * 2 + a.amber))
}
