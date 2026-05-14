import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionWrapper from '@/components/SessionWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A beautiful todo application with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
