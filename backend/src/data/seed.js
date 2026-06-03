export const CLASS_TOPICS = [
  'Algebra',
  'Fractions',
  "Newton's Laws",
  'Geometry',
  'Statistics',
  'Trigonometry',
]

export const DEMO_USERS = {
  student: {
    id: 'student-1',
    name: 'Alex Chen',
    email: 'alex.chen@student.learnify.demo',
    role: 'student',
    className: 'Math 10A',
  },
  teacher: {
    id: 'teacher-1',
    name: 'Dr. Sarah Williams',
    email: 's.williams@teacher.learnify.demo',
    role: 'teacher',
    className: 'Math 10A',
  },
}

export const INITIAL_STUDENTS = [
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
        closureBefore: 22,
        closureAfter: 38,
        peerPercentile: 28,
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
        closureBefore: 30,
        closureAfter: 42,
        peerPercentile: 32,
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
        closureBefore: 48,
        closureAfter: 58,
        peerPercentile: 45,
      },
    ],
    interventions: [
      'Assign flashcard drill on Fractions',
      "Schedule 1:1 on Newton's Laws",
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
      { topic: 'Algebra', severity: 'red', confidence: 30, accuracy: 28, trend: 'widening', timeOnTopicHours: 0.5, notesEngagement: 5, quizScore: 25, recommendedAction: 'Assign remedial Algebra module', closureBefore: 15, closureAfter: 28, peerPercentile: 12 },
      { topic: 'Fractions', severity: 'red', confidence: 40, accuracy: 35, trend: 'widening', timeOnTopicHours: 0.8, notesEngagement: 10, quizScore: 30, recommendedAction: 'Assign flashcard drill on Fractions', closureBefore: 18, closureAfter: 35, peerPercentile: 18 },
      { topic: "Newton's Laws", severity: 'red', confidence: 35, accuracy: 32, trend: 'stagnant', timeOnTopicHours: 1.0, notesEngagement: 8, quizScore: 28, recommendedAction: "Schedule 1:1 on Newton's Laws", closureBefore: 20, closureAfter: 32, peerPercentile: 15 },
      { topic: 'Geometry', severity: 'amber', confidence: 50, accuracy: 48, trend: 'stagnant', timeOnTopicHours: 2.0, notesEngagement: 25, quizScore: 45, recommendedAction: 'Peer study group on proofs', closureBefore: 40, closureAfter: 48, peerPercentile: 38 },
      { topic: 'Statistics', severity: 'amber', confidence: 55, accuracy: 52, trend: 'improving', timeOnTopicHours: 3.0, notesEngagement: 30, quizScore: 50, recommendedAction: 'Extra practice on mean/median', closureBefore: 42, closureAfter: 52, peerPercentile: 42 },
    ],
    interventions: [
      'Assign flashcard drill on Fractions',
      "Schedule 1:1 on Newton's Laws",
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
      { topic: 'Fractions', severity: 'amber', confidence: 58, accuracy: 55, trend: 'improving', timeOnTopicHours: 3.5, notesEngagement: 50, quizScore: 58, recommendedAction: 'Continue current practice path', closureBefore: 45, closureAfter: 55, peerPercentile: 52 },
      { topic: 'Statistics', severity: 'amber', confidence: 60, accuracy: 57, trend: 'stagnant', timeOnTopicHours: 2.8, notesEngagement: 40, quizScore: 55, recommendedAction: 'Assign statistics worksheet', closureBefore: 50, closureAfter: 57, peerPercentile: 48 },
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
      { topic: 'Trigonometry', severity: 'green', confidence: 85, accuracy: 88, trend: 'improving', timeOnTopicHours: 6.0, notesEngagement: 80, quizScore: 90, recommendedAction: 'Ready for advanced topics', closureBefore: 78, closureAfter: 88, peerPercentile: 88 },
      { topic: 'Algebra', severity: 'green', confidence: 90, accuracy: 92, trend: 'improving', timeOnTopicHours: 8.0, notesEngagement: 85, quizScore: 94, recommendedAction: 'No action needed', closureBefore: 85, closureAfter: 92, peerPercentile: 92 },
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
      { topic: 'Algebra', severity: 'red', confidence: 42, accuracy: 38, trend: 'widening', timeOnTopicHours: 0.3, notesEngagement: 5, quizScore: 32, recommendedAction: 'Urgent: Assign Algebra basics module', closureBefore: 25, closureAfter: 38, peerPercentile: 22 },
      { topic: 'Fractions', severity: 'red', confidence: 38, accuracy: 35, trend: 'widening', timeOnTopicHours: 0.2, notesEngagement: 3, quizScore: 28, recommendedAction: 'Assign flashcard drill on Fractions', closureBefore: 20, closureAfter: 35, peerPercentile: 16 },
      { topic: 'Geometry', severity: 'amber', confidence: 48, accuracy: 45, trend: 'stagnant', timeOnTopicHours: 1.5, notesEngagement: 20, quizScore: 42, recommendedAction: 'Review angle relationships', closureBefore: 38, closureAfter: 45, peerPercentile: 35 },
      { topic: "Newton's Laws", severity: 'amber', confidence: 52, accuracy: 48, trend: 'stagnant', timeOnTopicHours: 1.0, notesEngagement: 15, quizScore: 45, recommendedAction: 'Watch concept video + quiz', closureBefore: 40, closureAfter: 48, peerPercentile: 40 },
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
      { topic: "Newton's Laws", severity: 'amber', confidence: 55, accuracy: 50, trend: 'improving', timeOnTopicHours: 3.0, notesEngagement: 35, quizScore: 52, recommendedAction: "Schedule 1:1 on Newton's Laws", closureBefore: 42, closureAfter: 50, peerPercentile: 44 },
      { topic: 'Geometry', severity: 'amber', confidence: 58, accuracy: 54, trend: 'stagnant', timeOnTopicHours: 2.5, notesEngagement: 30, quizScore: 50, recommendedAction: 'Practice proof exercises', closureBefore: 48, closureAfter: 54, peerPercentile: 46 },
    ],
    interventions: ["Schedule 1:1 on Newton's Laws"],
  },
]

export function buildInitialNotifications() {
  const items = [
    {
      id: 'n-student-1',
      userId: 'student-1',
      role: 'student',
      type: 'gap',
      urgency: 92,
      title: 'Critical Gap Detected',
      message: 'We found a critical gap in Algebra that is blocking your progress in Applied Math.',
      read: false,
      timestamp: '2 minutes ago',
    },
    {
      id: 'n-student-2',
      userId: 'student-1',
      role: 'student',
      type: 'streak',
      urgency: 78,
      title: 'Streak-aware nudge',
      message: 'You skipped Algebra review for 5 days — your gap score rose 12 points.',
      read: false,
      timestamp: '1 hour ago',
    },
    {
      id: 'n-student-3',
      userId: 'student-1',
      role: 'student',
      type: 'notes',
      urgency: 65,
      title: 'Notes engagement alert',
      message: 'Shallow understanding flagged: Statistics notes show surface-level engagement only.',
      read: true,
      timestamp: '3 hours ago',
    },
    {
      id: 'n-student-4',
      userId: 'student-1',
      role: 'student',
      type: 'achievement',
      urgency: 20,
      title: 'Milestone Reached',
      message: 'You completed 50 study sessions! You earned the Consistent Learner badge.',
      read: true,
      timestamp: '1 day ago',
    },
  ]

  for (const student of INITIAL_STUDENTS.filter((s) => s.urgencyScore >= 70 && s.id !== 'student-1')) {
    items.push({
      id: `n-teacher-gap-${student.id}`,
      userId: 'teacher-1',
      role: 'teacher',
      type: 'gap',
      urgency: student.urgencyScore,
      title: `At-risk: ${student.name}`,
      message: `${student.topicsNeedingAttention} critical gaps detected. Urgency score rose to ${student.urgencyScore}.`,
      read: false,
      timestamp: `${student.urgencyScore >= 85 ? '1' : '3'}h ago`,
    })
  }

  items.push({
    id: 'n-teacher-cluster',
    userId: 'teacher-1',
    role: 'teacher',
    type: 'cluster',
    urgency: 85,
    title: 'Topic cluster alert: Fractions',
    message: '4 students struggling with Fractions simultaneously. Bulk intervention recommended.',
    read: false,
    timestamp: '3h ago',
  })

  return items
}

export function buildInitialFeedback() {
  return [
    {
      id: 'fb-1',
      studentId: 'student-1',
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Williams',
      type: 'text',
      message: 'Focus on Algebra fundamentals this week — your gap trend is widening. Complete the remedial module before Friday.',
      createdAt: new Date(Date.now() - 3600000),
    },
  ]
}

export function buildInitialInterventions() {
  const items = []
  for (const student of INITIAL_STUDENTS) {
    for (const action of student.interventions) {
      items.push({
        id: `int-${student.id}-${action.slice(0, 12).replace(/\W/g, '')}`,
        studentId: student.id,
        action,
        status: 'pending',
        appliedBy: 'teacher-1',
        createdAt: new Date(),
      })
    }
  }
  return items
}

export const INITIAL_QUIZ = {
  id: 'quiz-calculus-1',
  title: 'Calculus Fundamentals - Derivatives',
  topic: 'Calculus Fundamentals',
  questions: [
    {
      id: 1,
      question: 'What is the derivative of f(x) = x³?',
      type: 'multiple-choice',
      options: ['3x²', '3x', 'x²', '3'],
      correct: 0,
      explanation: 'Using the power rule: d/dx(x³) = 3x²',
    },
    {
      id: 2,
      question: 'Which of the following is the chain rule?',
      type: 'multiple-choice',
      options: [
        "(f·g)'(x) = f'(x)·g'(x)",
        "(f∘g)'(x) = f'(g(x))·g'(x)",
        "(f+g)'(x) = f'(x) + g'(x)",
        "(f/g)'(x) = [f'(x)g(x) - f(x)g'(x)] / [g(x)]²",
      ],
      correct: 1,
      explanation: 'The chain rule states that the derivative of a composite function is the derivative of the outer function times the derivative of the inner function.',
    },
    {
      id: 3,
      question: 'Find ∫2x dx',
      type: 'multiple-choice',
      options: ['x² + C', '2x² + C', 'x + C', 'x² + 2C'],
      correct: 0,
      explanation: 'Using the power rule for integration: ∫2x dx = 2 · (x²/2) + C = x² + C',
    },
    {
      id: 4,
      question: 'What is the value of e^(ln(5))?',
      type: 'multiple-choice',
      options: ['e⁵', '5', 'ln(e)', '√5'],
      correct: 1,
      explanation: 'By the properties of logarithms and exponentials: e^(ln(x)) = x, so e^(ln(5)) = 5',
    },
    {
      id: 5,
      question: 'Which statement about integrals is true?',
      type: 'multiple-choice',
      options: [
        'Definite integrals produce a function',
        'Indefinite integrals produce a number',
        'Indefinite integrals produce a family of functions',
        'All of the above',
      ],
      correct: 2,
      explanation: 'Indefinite integrals represent a family of functions differing by a constant C. Definite integrals produce a specific number.',
    },
  ],
}

export function buildInitialNotes(studentId = 'student-1') {
  return [
    {
      id: 'note-1',
      studentId,
      title: 'Calculus Derivatives',
      topic: 'Calculus Fundamentals',
      content: 'Key formulas for derivatives, power rule, chain rule, product rule, quotient rule.',
      preview: 'Key formulas for derivatives, power rule, chain rule...',
      keyPoints: ['Power Rule', 'Chain Rule', 'Product Rule', 'Quotient Rule'],
      status: 'complete',
      shallowFlag: false,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: 'note-2',
      studentId,
      title: 'Linear Algebra Matrices',
      topic: 'Linear Algebra',
      content: 'Matrix operations, determinants, eigenvalues, eigenvectors.',
      preview: 'Matrix operations, determinants, eigenvalues...',
      keyPoints: ['Matrix Multiplication', 'Determinants', 'Eigenvalues', 'Eigenvectors'],
      status: 'in-progress',
      shallowFlag: false,
      createdAt: new Date(Date.now() - 432000000),
      updatedAt: new Date(Date.now() - 432000000),
    },
    {
      id: 'note-3',
      studentId,
      title: 'Probability Basics',
      topic: 'Statistics',
      content: 'Conditional probability, independence, Bayes theorem — surface summary only.',
      preview: 'Conditional probability, independence, Bayes theorem...',
      keyPoints: ['Conditional Probability', 'Independence', 'Bayes Theorem', 'Random Variables'],
      status: 'needs-review',
      shallowFlag: true,
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 604800000),
    },
  ]
}

export function buildInitialFlashcards(studentId = 'student-1') {
  return {
    id: `deck-${studentId}-algebra`,
    studentId,
    topic: 'Algebra & Calculus',
    cards: [
      { id: 1, front: 'What is the derivative of f(x) = x³?', back: "f'(x) = 3x²", difficulty: 'easy' },
      { id: 2, front: 'State the power rule for derivatives', back: 'd/dx(xⁿ) = n·xⁿ⁻¹', difficulty: 'medium' },
      { id: 3, front: 'What is the chain rule?', back: "(f∘g)'(x) = f'(g(x))·g'(x)", difficulty: 'hard' },
      { id: 4, front: 'Derivative of sin(x)', back: 'cos(x)', difficulty: 'medium' },
      { id: 5, front: 'Derivative of eˣ', back: 'eˣ', difficulty: 'easy' },
    ],
  }
}

export function buildInitialStudyPlan(studentId = 'student-1') {
  return {
    id: `plan-${studentId}`,
    studentId,
    weekSchedule: [
      {
        day: 'Monday',
        tasks: [
          { title: 'Derivatives - Power Rule', duration: '45 min', status: 'completed', xp: 100 },
          { title: 'Practice Problems', duration: '30 min', status: 'in-progress', xp: 50 },
        ],
      },
      {
        day: 'Tuesday',
        tasks: [
          { title: 'Chain Rule Basics', duration: '50 min', status: 'pending', xp: 120 },
          { title: 'Interactive Examples', duration: '25 min', status: 'pending', xp: 60 },
        ],
      },
      {
        day: 'Wednesday',
        tasks: [{ title: 'Product & Quotient Rules', duration: '55 min', status: 'pending', xp: 130 }],
      },
      {
        day: 'Thursday',
        tasks: [{ title: 'Gap Review: Algebra', duration: '60 min', status: 'pending', xp: 150 }],
      },
      {
        day: 'Friday',
        tasks: [
          { title: 'Weekly Quiz', duration: '40 min', status: 'pending', xp: 100 },
          { title: 'Summary & Reflection', duration: '20 min', status: 'pending', xp: 50 },
        ],
      },
      {
        day: 'Saturday',
        tasks: [{ title: 'Flashcard Review', duration: '30 min', status: 'pending', xp: 75 }],
      },
      {
        day: 'Sunday',
        tasks: [{ title: 'Rest & Planning', duration: 'Flexible', status: 'pending', xp: 0 }],
      },
    ],
    stats: { weekXp: 1250, studyTime: '8h 45m', tasksCompleted: 4, totalTasks: 12 },
  }
}

export function buildInitialAnalytics(studentId = 'student-1') {
  return {
    id: `analytics-${studentId}`,
    studentId,
    totalXp: 6170,
    totalStudyHours: 42,
    avgSessionMinutes: 38,
    badgesEarned: 7,
    xpByWeek: [
      { week: 'Week 1', xp: 520 },
      { week: 'Week 2', xp: 680 },
      { week: 'Week 3', xp: 750 },
      { week: 'Week 4', xp: 890 },
      { week: 'Week 5', xp: 1050 },
      { week: 'Week 6', xp: 1200 },
    ],
    timeByDay: [
      { day: 'Mon', hours: 1.5 },
      { day: 'Tue', hours: 2.0 },
      { day: 'Wed', hours: 1.8 },
      { day: 'Thu', hours: 2.5 },
      { day: 'Fri', hours: 2.2 },
      { day: 'Sat', hours: 3.0 },
      { day: 'Sun', hours: 1.5 },
    ],
    topicPerformance: [
      { topic: 'Algebra', mastery: 38, confidence: 45 },
      { topic: 'Statistics', mastery: 42, confidence: 55 },
      { topic: 'Trigonometry', mastery: 58, confidence: 62 },
      { topic: 'Fractions', mastery: 55, confidence: 58 },
      { topic: 'Geometry', mastery: 85, confidence: 88 },
    ],
    scatterData: [
      { x: 45, y: 38, name: 'Algebra' },
      { x: 55, y: 42, name: 'Statistics' },
      { x: 62, y: 58, name: 'Trigonometry' },
      { x: 58, y: 55, name: 'Fractions' },
      { x: 85, y: 88, name: 'Geometry' },
    ],
    heatmap: Array.from({ length: 12 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => ({
        week,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
        count: (week * 7 + day) % 5,
      }))
    ).flat(),
  }
}

export function buildInitialTutorMessages(studentId = 'student-1') {
  return [
    {
      id: 'tm-1',
      studentId,
      role: 'assistant',
      content: "Hello! I'm your Tutor. I can help with any Math 10A topic. What would you like to learn about today?",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: 'tm-2',
      studentId,
      role: 'user',
      content: "Can you explain derivatives and how they're used?",
      createdAt: new Date(Date.now() - 86300000),
    },
    {
      id: 'tm-3',
      studentId,
      role: 'assistant',
      content: "A derivative measures how a function changes as its input changes — the instantaneous rate of change.\n\nKey concepts:\n• Notation: f'(x) or df/dx\n• Geometrically: slope of the tangent line\n\nCommon derivatives:\n• d/dx(x²) = 2x\n• d/dx(sin x) = cos x\n• d/dx(eˣ) = eˣ\n\nWould you like a worked example?",
      createdAt: new Date(Date.now() - 86200000),
    },
  ]
}

export function buildStudentDashboardExtras(studentId = 'student-1') {
  const student = INITIAL_STUDENTS.find((s) => s.id === studentId) ?? INITIAL_STUDENTS[0]
  return {
    streak: student.streak,
    xp: 6170,
    level: 6,
    masteryPercent: Math.round(100 - student.overallGapScore),
    heatmap: buildInitialAnalytics(studentId).heatmap,
    stats: {
      topicsOnTrack: student.gaps.filter((g) => g.severity === 'green').length,
      topicsNeedReview: student.gaps.filter((g) => g.severity === 'amber').length,
      topicsCritical: student.gaps.filter((g) => g.severity === 'red').length,
      studyHoursWeek: 8.75,
    },
  }
}

export function buildInitialFocusSessions(studentId = 'student-1') {
  return [
    { id: 'fs-1', studentId, mode: 'work', durationMinutes: 25, completedAt: new Date(Date.now() - 86400000 * 2) },
    { id: 'fs-2', studentId, mode: 'work', durationMinutes: 25, completedAt: new Date(Date.now() - 86400000) },
    { id: 'fs-3', studentId, mode: 'break', durationMinutes: 5, completedAt: new Date(Date.now() - 86300000) },
    { id: 'fs-4', studentId, mode: 'work', durationMinutes: 25, completedAt: new Date(Date.now() - 3600000) },
    { id: 'fs-5', studentId, mode: 'work', durationMinutes: 25, completedAt: new Date(Date.now() - 1800000) },
  ]
}

export function buildInitialQuizAttempts(studentId = 'student-1') {
  return [
    {
      id: 'attempt-1',
      studentId,
      quizId: 'quiz-calculus-1',
      answers: [0, 1, 0, 1, 2],
      score: 80,
      insights: [
        { type: 'timing', message: 'Correct but 3× slower on Calculus — review power rule fundamentals.' },
        { type: 'accuracy', message: 'Missed integration question — gap on integrals flagged.' },
      ],
      completedAt: new Date(Date.now() - 7200000),
    },
    {
      id: 'attempt-2',
      studentId,
      quizId: 'quiz-calculus-1',
      answers: [0, 1, 0, 1, 2],
      score: 100,
      insights: [{ type: 'achievement', message: 'Perfect score on Calculus Fundamentals quiz!' }],
      completedAt: new Date(Date.now() - 86400000),
    },
  ]
}

export function buildInitialFlashcardsForStudents() {
  return INITIAL_STUDENTS.slice(0, 3).map((s, i) => ({
    id: `deck-${s.id}`,
    studentId: s.id,
    topic: i === 0 ? 'Algebra & Calculus' : i === 1 ? 'Fractions & Algebra' : 'Statistics',
    cards: [
      { id: 1, front: `Core concept for ${s.name}`, back: 'Answer from gap remediation path', difficulty: 'medium' },
      { id: 2, front: 'Power rule: d/dx(xⁿ)', back: 'n·xⁿ⁻¹', difficulty: 'easy' },
      { id: 3, front: 'Chain rule', back: "(f∘g)'(x) = f'(g(x))·g'(x)", difficulty: 'hard' },
    ],
  }))
}

export function buildInitialAnalyticsForStudents() {
  return INITIAL_STUDENTS.map((s) => ({
    ...buildInitialAnalytics(s.id),
    id: `analytics-${s.id}`,
    studentId: s.id,
    totalXp: s.id === 'student-1' ? 6170 : 800 + s.urgencyScore * 10,
    totalStudyHours: Math.round(20 + s.streak * 1.5),
  }))
}

export function buildInitialStudyPlansForStudents() {
  const base = buildInitialStudyPlan('student-1')
  return INITIAL_STUDENTS.slice(0, 4).map((s) => ({
    ...structuredClone(base),
    id: `plan-${s.id}`,
    studentId: s.id,
  }))
}

export function buildInitialNotesForStudents() {
  const base = buildInitialNotes('student-1')
  return INITIAL_STUDENTS.slice(0, 3).flatMap((s) =>
    base.map((n, i) => ({
      ...n,
      id: `note-${s.id}-${i + 1}`,
      studentId: s.id,
      title: `${n.title} (${s.name.split(' ')[0]})`,
    }))
  )
}

export function buildInitialTutorMessagesForStudents() {
  return INITIAL_STUDENTS.slice(0, 3).flatMap((s) =>
    buildInitialTutorMessages(s.id).map((m) => ({ ...m, id: `${m.id}-${s.id}` }))
  )
}

