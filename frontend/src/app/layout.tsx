import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import { AuthProvider } from '@/features/auth/auth-context'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Learnify',
  description: 'Learning gap detection and feedback for students and teachers',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`} style={{ backgroundColor: 'var(--bg-base)' }}>
      <body className="font-sans antialiased min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
