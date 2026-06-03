'use client'

import { Header } from '@/widgets/layout/Header'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Send, Mic, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/auth-context'
import { tutorApi, type TutorMessage } from '@/services'
import { DEMO_STUDENT } from '@/shared/mocks/users'

export default function AITutor() {
  const { user } = useAuth()
  const studentId = user?.id ?? DEMO_STUDENT.id
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    tutorApi.getMessages(studentId).then(setMessages).catch(() => {})
  }, [studentId])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    try {
      const res = await tutorApi.send(studentId, content)
      setMessages((prev) => [...prev, res.user, res.assistant])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, studentId, role: 'user', content },
      ])
    } finally {
      setSending(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <Header
        title="Tutor"
        subtitle="Get personalized explanations and help with any topic"
        showSearch={false}
      />

      <main className="p-8 h-[calc(100vh-200px)] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-5 py-3'
                    : 'bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-3'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copiedId === message.id ? (
                      <><Check className="w-3 h-3" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Card className="p-4 bg-card border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about Algebra, derivatives, gap remediation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button variant="outline" size="icon" disabled>
              <Mic className="w-4 h-4" />
            </Button>
            <Button onClick={handleSend} disabled={sending || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </main>
    </>
  )
}
