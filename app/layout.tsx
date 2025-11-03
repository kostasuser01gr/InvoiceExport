import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invoice Export - Europcar × Goldcar',
  description: 'Multi-tenant invoicing system for Europcar and Goldcar Greece',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
