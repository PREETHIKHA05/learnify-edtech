'use client'

import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Progress } from '@/shared/ui/progress'
import { ChevronLeft, ChevronRight, RotateCw, Volume2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/auth-context'
import { flashcardsApi } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

export default function Flashcards() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [flashcards, setFlashcards] = useState<Array<{ id: number; front: string; back: string; difficulty: string }>>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [marked, setMarked] = useState<number[]>([])
  const [difficulty, setDifficulty] = useState<{ [key: number]: 'easy' | 'medium' | 'hard' }>({})

  useEffect(() => {
    flashcardsApi.getDeck(studentId).then((deck) => setFlashcards(deck.cards)).catch(() => {})
  }, [studentId])

  if (!flashcards.length) {
    return (
      <>
        <Header title="Flashcards" subtitle="Loading deck from API…" />
        <main className="p-8"><p className="text-foreground">Loading flashcards…</p></main>
      </>
    )
  }

  const card = flashcards[currentCard]
  const isMarked = marked.includes(card.id)

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setIsFlipped(false)
    }
  }

  const handleMark = () => {
    if (isMarked) {
      setMarked(marked.filter(id => id !== card.id))
    } else {
      setMarked([...marked, card.id])
    }
  }

  const handleSetDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty({ ...difficulty, [card.id]: level })
    flashcardsApi.review(studentId, card.id, level).catch(() => {})
  }

  return (
    <>
                <Header
          title="Flashcards"
          subtitle="Calculus Fundamentals - Master key concepts with spaced repetition"
        />

        <main className="p-8 space-y-8">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Card {currentCard + 1} of {flashcards.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Marked: {marked.length}
              </span>
            </div>
            <Progress value={((currentCard + 1) / flashcards.length) * 100} />
          </div>

          {/* Flashcard */}
          <div className="flex justify-center">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-2xl h-80 bg-muted border-2 border-primary rounded-xl p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-lg "
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {isFlipped ? 'Answer' : 'Question'}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {isFlipped ? card.back : card.front}
                </p>
                <p className="text-xs text-muted-foreground mt-6">Click to flip</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentCard === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {flashcards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentCard(idx)
                      setIsFlipped(false)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentCard ? 'bg-primary w-8' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentCard === flashcards.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFlipped(!isFlipped)}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Flip Card
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Pronounce
              </Button>
              <Button
                variant={isMarked ? 'default' : 'outline'}
                size="sm"
                onClick={handleMark}
              >
                {isMarked ? '★ Marked' : '☆ Mark'}
              </Button>
            </div>
          </div>

          {/* Difficulty Rating */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">How difficult was this card?</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <Button
                  key={level}
                  variant={difficulty[card.id] === level ? 'default' : 'outline'}
                  onClick={() => handleSetDifficulty(level)}
                  className="capitalize"
                >
                  {level === 'easy' ? '👍 Easy' : level === 'medium' ? '➡️ Medium' : '😤 Hard'}
                </Button>
              ))}
            </div>
          </Card>

          {/* Study Tips */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Study Tips</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex gap-3">
                <span className="text-foreground">•</span>
                <span>Mark difficult cards to study them more frequently</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground">•</span>
                <span>Rate difficulty to optimize your learning schedule</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground">•</span>
                <span>Review each flashcard at increasing intervals (1 day, 3 days, 1 week, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground">•</span>
                <span>Spend 15-20 minutes per study session for best retention</span>
              </li>
            </ul>
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Cards</p>
                <p className="text-2xl font-bold text-foreground">{flashcards.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Marked</p>
                <p className="text-2xl font-bold text-muted-foreground">{marked.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Study Streak</p>
                <p className="text-2xl font-bold text-foreground">5 Days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mastered</p>
                <p className="text-2xl font-bold text-muted-foreground">18</p>
              </div>
            </div>
          </Card>
        </main>
    </>
  )
}
