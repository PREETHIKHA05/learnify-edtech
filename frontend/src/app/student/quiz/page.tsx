'use client'

import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Progress } from '@/shared/ui/progress'
import { GapPill } from '@/shared/ui/common/gap-pill'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/features/auth/auth-context'
import { quizApi, type Quiz, type QuizQuestion } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

const QUIZ_ID = 'quiz-calculus-1'
const AVG_SECONDS = 15

export default function Quiz() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizTitle, setQuizTitle] = useState('Quiz')
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [quizInsights, setQuizInsights] = useState<Array<{ type: string; message: string }>>([])
  const questionStartRef = useRef(Date.now())
  const timeSpentRef = useRef<number[]>(Array(quizQuestions.length).fill(0))

  useEffect(() => {
    quizApi.getById(QUIZ_ID).then((quiz: Quiz) => {
      setQuizQuestions(quiz.questions)
      setQuizTitle(quiz.title)
      setSelectedAnswers(Array(quiz.questions.length).fill(null))
      timeSpentRef.current = Array(quiz.questions.length).fill(0)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    questionStartRef.current = Date.now()
  }, [currentQuestion])

  if (loading || !quizQuestions.length) {
    return (
      <>
        <Header title="Quiz" subtitle="Loading quiz from API…" showSearch={false} />
        <main className="p-8"><p className="text-foreground">Loading quiz…</p></main>
      </>
    )
  }

  const question = quizQuestions[currentQuestion]
  const answered = selectedAnswers[currentQuestion] !== null
  const isCorrect = selectedAnswers[currentQuestion] === question.correct

  const handleSelectAnswer = (optionIndex: number) => {
    if (!completed) {
      const elapsed = (Date.now() - questionStartRef.current) / 1000
      timeSpentRef.current[currentQuestion] = elapsed
      const newAnswers = [...selectedAnswers]
      newAnswers[currentQuestion] = optionIndex
      setSelectedAnswers(newAnswers)
    }
  }

  const submitQuizToApi = async (answers: (number | null)[]) => {
    try {
      const res = await quizApi.submitAttempt(QUIZ_ID, studentId, answers, timeSpentRef.current)
      setQuizInsights(res.insights)
    } catch {
      // fallback per-question feedback
      const allInsights: Array<{ type: string; message: string }> = []
      for (let idx = 0; idx < quizQuestions.length; idx++) {
        const answer = answers[idx]
        if (answer === null) continue
        const correct = answer === quizQuestions[idx].correct
        const seconds = timeSpentRef.current[idx] || AVG_SECONDS
        const timeMultiplier = Math.max(1, Math.round(seconds / AVG_SECONDS))
        try {
          const res = await quizApi.submitFeedback(studentId, {
            correct,
            timeMultiplier,
            topic: quizTitle,
            shallowNotes: idx === 2 && !correct,
          })
          allInsights.push(...res.insights)
        } catch { /* ignore */ }
      }
      setQuizInsights(allInsights)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
      setShowResults(true)
      submitQuizToApi(selectedAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const correctCount = selectedAnswers.reduce((count, answer, idx) => 
    count + (answer === quizQuestions[idx].correct ? 1 : 0), 0
  )
  const percentage = Math.round((correctCount / quizQuestions.length) * 100)

  if (completed && showResults) {
    return (
      <>
                <Header title="Quiz Results" subtitle={quizTitle} />
          
          <main className="p-8 space-y-8">
            {/* Score Card */}
            <Card className="p-8 bg-card border-border text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-foreground mb-2">{percentage}%</div>
                <p className="text-muted-foreground mb-4">
                  {correctCount} out of {quizQuestions.length} questions correct
                </p>
                <GapPill 
                  status={percentage >= 80 ? 'on-track' : percentage >= 50 ? 'needs-review' : 'critical'}
                  size="lg"
                />
              </div>
            </Card>

            {/* Performance */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6">Your Performance</h3>
              <div className="space-y-4">
                {quizQuestions.map((q, idx) => {
                  const answer = selectedAnswers[idx]
                  const correct = answer === q.correct
                  return (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {answer !== null && correct ? (
                        <CheckCircle2 className="w-5 h-5 text-foreground flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          Question {idx + 1}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-foreground">
                      {answer === null ? 'Skipped' : correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                )})}
              </div>
            </Card>

            {quizInsights.length > 0 && (
              <Card className="p-6 bg-card border-border border-l-[3px] border-l-[var(--accent-warn)]">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Post-Quiz Gap Insights
                </h3>
                <div className="space-y-3">
                  {quizInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <AlertCircle className="w-4 h-4 text-[var(--accent-warn)] mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="py-6">
                Review Quiz
              </Button>
              <Button className="py-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Learn More
              </Button>
              <Button variant="outline" className="py-6">
                Next Quiz
              </Button>
            </div>
          </main>
    </>
    )
  }

  return (
    <>
                <Header
          title="Quiz"
          subtitle={quizTitle}
          showSearch={false}
        />

        <main className="p-8 space-y-8">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {correctCount} Correct
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} />
          </div>

          {/* Question Card */}
          <Card className="p-8 bg-card border-border space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{question.question}</h2>
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={completed}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
                      selectedAnswers[currentQuestion] === idx
                        ? 'border-primary bg-muted text-foreground'
                        : 'border-border bg-muted text-foreground hover:border-primary/50'
                    } ${completed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {selectedAnswers[currentQuestion] === idx && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {answered && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-muted border border-border' : 'bg-muted border border-border'}`}>
                <p className={`font-semibold mb-2 ${isCorrect ? 'text-foreground' : 'text-destructive'}`}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="text-sm text-foreground">{question.explanation}</p>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: quizQuestions.length }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    idx === currentQuestion
                      ? 'bg-primary text-primary-foreground'
                      : selectedAnswers[idx] !== null
                      ? 'bg-muted text-foreground border border-border'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </main>
    </>
  )
}
