import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth/context'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'WKND_CO - Authentication',
  description: 'Next.js authentication with Supabase',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
