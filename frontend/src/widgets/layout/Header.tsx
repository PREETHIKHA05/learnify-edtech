import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

interface HeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
}

export function Header({ title, subtitle, showSearch = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-sm border-b border-border">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-foreground mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {showSearch && (
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent-primary)]" />
              <Input
                placeholder="Search..."
                className="pl-10 pr-4 w-64 bg-background border-border focus-visible:ring-primary"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[var(--accent-glow)] hover:text-[var(--accent-primary)]"
          >
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[var(--accent-glow)] hover:text-[var(--accent-primary)]"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
