import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="ml-64 min-h-screen bg-background">
      {children}
    </div>
  )
}
