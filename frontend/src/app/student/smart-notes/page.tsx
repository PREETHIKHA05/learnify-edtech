'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Plus, Lightbulb, BookMarked, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'
import { gapsApi, notesApi, type Note } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

export default function SmartNotes() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [notesFlags, setNotesFlags] = useState<Array<{ topic: string; message: string }>>([])
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    gapsApi.getReport(studentId).then((r) => setNotesFlags(r.notesFlags)).catch(() => {})
    notesApi.list(studentId).then(setNotes).catch(() => {})
  }, [studentId])

  const summaryNote = notes.find((n) => n.status === 'complete') ?? notes[0]
  const mockSummary = summaryNote?.content ?? 'Add notes to generate AI summaries.'

  return (
    <>
                <Header
          title="Smart Notes"
          subtitle="AI-organized notes with automatic summaries and key points"
        />

        <main className="p-8 space-y-8">
          {notesFlags.length > 0 && (
            <Card className="p-5 bg-card border-border border-l-[3px] border-l-[var(--accent-warn)]">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--accent-warn)]" />
                Shallow Understanding Flags
              </h3>
              <div className="space-y-2">
                {notesFlags.map((flag) => (
                  <div key={flag.topic} className="text-sm p-3 bg-muted rounded">
                    <p className="font-medium text-foreground">{flag.topic}</p>
                    <p className="text-foreground">{flag.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Create New Note */}
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-5 h-5" />
            Create New Note
          </Button>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="notes">All Notes</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="summaries">Summaries</TabsTrigger>
            </TabsList>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`p-5 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer ${note.shallowFlag ? 'border-l-[3px] border-l-[var(--accent-warn)]' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground flex-1 pr-2">{note.title}</h3>
                      {note.shallowFlag && (
                        <span className="text-xs text-[var(--accent-warn)]">Shallow</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{note.topic}</p>
                    <p className="text-sm text-foreground/80 mb-3">{note.preview}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.keyPoints.map((point) => (
                        <span key={point} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                          {point}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{note.status}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-muted-foreground" />
                  Important Highlights
                </h3>
                <div className="space-y-4">
                  {[
                    'The Fundamental Theorem of Calculus connects differentiation and integration',
                    'Chain rule is essential for complex derivatives: (f∘g)\'(x) = f\'(g(x)) × g\'(x)',
                    'Integration by parts follows the formula: ∫u dv = uv - ∫v du',
                    'Power series can approximate functions with polynomials to arbitrary accuracy',
                  ].map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted border-l-2 border-border rounded"
                    >
                      <p className="text-sm text-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Summaries Tab */}
            <TabsContent value="summaries" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-muted-foreground" />
                  Generated Summary
                </h3>
                <div className="space-y-4 text-sm text-foreground leading-relaxed">
                  {mockSummary.split('\n\n').map((para, idx) => (
                    <p key={idx} className="whitespace-pre-wrap">{para}</p>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" size="sm">
                    Regenerate Summary
                  </Button>
                  <Button variant="outline" size="sm">
                    Create Flashcards
                  </Button>
                </div>
              </Card>

              {/* Key Points */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Takeaways</h3>
                <div className="space-y-2">
                  {[
                    'Calculus studies continuous change through derivatives and integrals',
                    'Derivatives represent instantaneous rates of change',
                    'Integrals represent accumulated quantities and areas',
                    'The FTC links these two fundamental concepts',
                    'Applications span physics, engineering, economics, and medicine',
                  ].map((point, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="text-foreground font-bold">→</span>
                      <p className="text-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
    </>
  )
}
