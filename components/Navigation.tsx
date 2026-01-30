'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Menu, X } from 'lucide-react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <BarChart3 className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Datavizzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/work"
              className={`text-sm font-medium transition-colors ${
                isActive('/work') ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Work
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pricing
            </Link>
            {isSignedIn && (
              <Link
                href="/submit-request"
                className={`text-sm font-medium transition-colors ${
                  isActive('/submit-request') ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Submit Request
              </Link>
            )}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-lg font-semibold transition-all transform hover:scale-105">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-4 py-2 rounded ${isActive('/') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
            >
              Home
            </Link>
            <Link
              href="/work"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-4 py-2 rounded ${isActive('/work') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
            >
              Work
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-left px-4 py-2 rounded ${isActive('/pricing') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
            >
              Pricing
            </Link>
            {isSignedIn && (
              <Link
                href="/submit-request"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left px-4 py-2 rounded ${isActive('/submit-request') ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
              >
                Submit Request
              </Link>
            )}
            {isSignedIn ? (
              <div className="px-4 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-slate-800 text-white rounded">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded font-semibold">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
