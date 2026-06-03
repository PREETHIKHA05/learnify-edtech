'use client'

import { Navigation } from '@/components/Navigation'
import { PageLayout } from '@/components/PageLayout'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Mic, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const mockMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m your AI Tutor. I\'m here to help you understand any concept in Mathematics. What would you like to learn about today?',
  },
  {
    id: 2,
    role: 'user',
    content: 'Can you explain derivatives and how they\'re used?',
  },
  {
    id: 3,
    role: 'assistant',
    content: 'Great question! A derivative measures how a function changes as its input changes. Think of it as the rate of change or the slope of a curve at any point.\n\nKey concepts:\n• The derivative tells us the instantaneous rate of change\n• Notation: f\'(x) or df/dx\n• Geometrically: it\'s the slope of the tangent line\n\nReal-world example: If you\'re driving, your position changes over time. The derivative of position with respect to time is your velocity - the rate at which your position changes.\n\nCommon derivatives:\n• d/dx(x²) = 2x\n• d/dx(sin x) = cos x\n• d/dx(eˣ) = eˣ\n\nWould you like me to explain the power rule or how to find derivatives step by step?',
  },
  {
    id: 4,
    role: 'user',
    content: 'Can you show me a worked example?',
  },
  {
    id: 5,
    role: 'assistant',
    content: 'Absolutely! Let\'s find the derivative of f(x) = 3x² + 2x + 5\n\nStep 1: Apply the power rule to each term\n• For 3x²: multiply by 2, reduce power by 1 → 6x\n• For 2x: the derivative is → 2\n• For 5 (constant): → 0\n\nStep 2: Combine all terms\nf\'(x) = 6x + 2\n\nThat\'s it! The derivative of f(x) = 3x² + 2x + 5 is f\'(x) = 6x + 2\n\nThis means at any point x, the slope of the original function is given by 6x + 2.\n\nNeed more practice? I can give you another example or we can move to applications!',
  },
]

export default function AITutor() {
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role: 'user',
        content: input,
      },
    ])
    setInput('')
  }

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <Navigation />
      <PageLayout>
        <Header
          title="AI Tutor"
          subtitle="Get personalized explanations and help with any topic"
          showSearch={false}
        />

        <main className="p-8 h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Container */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl ${
                    message.role === 'user'
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-card border border-border'
                  } rounded-lg p-4`}
                >
                  <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  {message.role === 'assistant' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <Card className="p-4 bg-card border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about this topic..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-muted border-border"
              />
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-primary"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Suggestions */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground w-full">Quick suggestions:</p>
            <Button variant="outline" size="sm" className="text-xs">
              Explain the chain rule
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Show more examples
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Quiz me on this
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Summarize this topic
            </Button>
          </div>
        </main>
      </PageLayout>
    </>
  )
}
