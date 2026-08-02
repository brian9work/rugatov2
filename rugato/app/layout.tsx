import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/lib/UserContext'

export const metadata: Metadata = {
  title: 'Rugato',
  description: 'Sistema de gestión — Jugos y Licuados Rugato',
  icons: { icon: '/logo-sm.webp', apple: '/logo-sm.webp' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
