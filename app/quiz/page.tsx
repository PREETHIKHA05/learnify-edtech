'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { GapPill } from '@/components/GapPill'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'

const quizQuestions = [
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
      '(f·g)\'(x) = f\'(x)·g\'(x)',
      '(f∘g)\'(x) = f\'(g(x))·g\'(x)',
      '(f+g)\'(x) = f\'(x) + g\'(x)',
      '(f/g)\'(x) = [f\'(x)g(x) - f(x)g\'(x)] / [g(x)]²',
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
]

const mockResults = [
  { id: 1, answered: true, correct: true },
  { id: 2, answered: true, correct: true },
  { id: 3, answered: true, correct: false },
  { id: 4, answered: false, correct: false },
  { id: 5, answered: true, correct: true },
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [completed, setCompleted] = useState(false)

  const question = quizQuestions[currentQuestion]
  const answered = selectedAnswers[currentQuestion] !== null
  const isCorrect = selectedAnswers[currentQuestion] === question.correct

  const handleSelectAnswer = (optionIndex: number) => {
    if (!completed) {
      const newAnswers = [...selectedAnswers]
      newAnswers[currentQuestion] = optionIndex
      setSelectedAnswers(newAnswers)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
      setShowResults(true)
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
        <Navigation />
        <PageLayout>
          <Header title="Quiz Results" subtitle="Calculus Fundamentals - Derivatives" />
          
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
                {mockResults.map((result, idx) => (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {result.correct ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          Question {result.id}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="py-6">
                Review Quiz
              </Button>
              <Button className="py-6 bg-gradient-to-r from-green-500 to-blue-500">
                Learn More
              </Button>
              <Button variant="outline" className="py-6">
                Next Quiz
              </Button>
            </div>
          </main>
        </PageLayout>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Quiz"
          subtitle="Calculus Fundamentals - Derivatives"
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
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-border bg-muted text-foreground hover:border-primary/50'
                    } ${completed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === idx
                            ? 'border-green-500 bg-green-500'
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
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/50' : 'bg-red-500/10 border border-red-500/50'}`}>
                <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
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
                      ? 'bg-green-500 text-white'
                      : selectedAnswers[idx] !== null
                      ? 'bg-muted text-foreground border border-green-500/50'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </main>
      </PageLayout>
    </>
  )
}
