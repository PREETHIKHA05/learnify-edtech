'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit2, Trash2, Lightbulb, BookMarked } from 'lucide-react'

const mockNotes = [
  {
    id: 1,
    title: 'Calculus Derivatives',
    topic: 'Calculus Fundamentals',
    date: '2 days ago',
    status: 'complete',
    preview: 'Key formulas for derivatives, power rule, chain rule...',
    keyPoints: ['Power Rule', 'Chain Rule', 'Product Rule', 'Quotient Rule'],
  },
  {
    id: 2,
    title: 'Linear Algebra Matrices',
    topic: 'Linear Algebra',
    date: '5 days ago',
    status: 'in-progress',
    preview: 'Matrix operations, determinants, eigenvalues...',
    keyPoints: ['Matrix Multiplication', 'Determinants', 'Eigenvalues', 'Eigenvectors'],
  },
  {
    id: 3,
    title: 'Probability Basics',
    topic: 'Probability Theory',
    date: '1 week ago',
    status: 'needs-review',
    preview: 'Conditional probability, independence, Bayes theorem...',
    keyPoints: ['Conditional Probability', 'Independence', 'Bayes Theorem', 'Random Variables'],
  },
]

const mockSummary = `
Calculus is the mathematical study of continuous change. It has two main branches:

1. **Differential Calculus** - Studies rates of change and slopes
   - Derivatives measure instantaneous rate of change
   - Applications: velocity, acceleration, optimization

2. **Integral Calculus** - Studies accumulation
   - Integrals find areas and accumulated quantities
   - Applications: total distance, area under curves

**Key Theorems:**
- Fundamental Theorem of Calculus: Links derivatives and integrals
- Mean Value Theorem: Guarantees existence of derivative at certain point
- Taylor Series: Approximates functions with polynomials

**Common Applications:**
- Physics: Motion and forces
- Engineering: Design and optimization
- Economics: Marginal analysis
- Medicine: Drug concentration modeling
`

export default function SmartNotes() {
  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="Smart Notes"
          subtitle="AI-organized notes with automatic summaries and key points"
        />

        <main className="p-8 space-y-8">
          {/* Create New Note */}
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 gap-2">
            <Plus className="w-5 h-5" />
            Create New Note
          </Button>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="bg-muted border-border">
              <TabsTrigger value="notes">All Notes</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="summaries">AI Summaries</TabsTrigger>
            </TabsList>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="p-5 bg-card border-border hover:border-primary/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground flex-1 pr-2">{note.title}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-muted rounded">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{note.topic}</p>
                    <p className="text-sm text-foreground/80 mb-3">{note.preview}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.keyPoints.map((point) => (
                        <span
                          key={point}
                          className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{note.date}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="space-y-4">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-blue-500" />
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
                      className="p-3 bg-blue-500/10 border-l-2 border-blue-500 rounded"
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
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  AI Generated Summary
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
                      <span className="text-green-500 font-bold">→</span>
                      <p className="text-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </PageLayout>
    </>
  )
}
