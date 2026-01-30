import './globals.css'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Datavizzy - Transform Your Data Into Stunning Visuals',
  description: 'Professional data visualization services that turn complex datasets into clear, compelling stories.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Navigation stays at the top */}
          <Navigation />

          {/* Clerk authentication UI */}
          <header style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1rem' }}>
            <SignedOut>
              <SignInButton>Sign In</SignInButton>
              <SignUpButton>Sign Up</SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          {/* Main page content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
