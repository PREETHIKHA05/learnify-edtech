'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/features/auth/auth-context'
import { Logo } from '@/shared/ui/logo'

const navItems = [
  { href: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/gap-detection', icon: Zap, label: 'Gap Detection' },
  { href: '/student/ai-tutor', icon: Brain, label: 'Tutor' },
  { href: '/student/smart-notes', icon: BookOpen, label: 'Notes' },
  { href: '/student/quiz', icon: ListTodo, label: 'Quiz' },
  { href: '/student/flashcards', icon: Zap, label: 'Flashcards' },
  { href: '/student/study-planner', icon: ListTodo, label: 'Study Planner' },
  { href: '/student/focus-room', icon: Wind, label: 'Focus Room' },
  { href: '/student/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/student/notifications', icon: Bell, label: 'Notifications' },
]

export function StudentNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="sidebar-panel fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="sidebar-header border-b border-sidebar-border">
        <Link href="/student" className="flex items-center gap-[var(--sidebar-gap)]">
          <Logo subtitle="Student" accent="primary" size="sidebar" />
        </Link>
        {user && <p className="sidebar-user text-foreground truncate font-medium">{user.name}</p>}
      </div>

      <nav className="sidebar-section flex-1 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/student'
              ? pathname === '/student'
              : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-nav-item',
                isActive
                  ? 'nav-item-active font-semibold'
                  : 'text-sidebar-foreground nav-item-hover'
              )}
            >
              <Icon className="sidebar-icon" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-section border-t border-sidebar-border space-y-1">
        <button className="sidebar-nav-item w-full text-sidebar-foreground nav-item-hover">
          <Settings className="sidebar-icon" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="sidebar-nav-item w-full text-muted-foreground hover:bg-[color-mix(in_srgb,var(--accent-danger)_12%,transparent)] hover:text-[var(--accent-danger)]"
        >
          <LogOut className="sidebar-icon" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
