import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="sidebar-main-offset min-h-screen bg-background">
      {children}
    </div>
  )
}
