import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AcademicProfessor',
  description: 'IA project to help students with their academic needs',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
