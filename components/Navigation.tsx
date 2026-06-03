'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Zap,
  BookOpen,
  Brain,
  ListTodo,
  Wind,
  Bell,
  BarChart3,
  LogOut,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/gap-detection', icon: Zap, label: 'Gap Detection' },
  { href: '/ai-tutor', icon: Brain, label: 'AI Tutor' },
  { href: '/smart-notes', icon: BookOpen, label: 'Smart Notes' },
  { href: '/quiz', icon: ListTodo, label: 'Quiz' },
  { href: '/flashcards', icon: Zap, label: 'Flashcards' },
  { href: '/study-planner', icon: ListTodo, label: 'Study Planner' },
  { href: '/focus-room', icon: Wind, label: 'Focus Room' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-lg">Learnify</span>
            <span className="text-xs text-muted-foreground">AI Learning</span>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}
