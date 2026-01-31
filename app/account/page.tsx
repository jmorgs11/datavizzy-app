'use client'

import { useUser } from '@clerk/nextjs'
import { CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const hasActiveSubscription = user?.publicMetadata?.hasActiveSubscription === true

  const handleManageSubscription = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Please Sign In</h2>
          <p className="text-slate-400 mb-6">You need to be signed in to view your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>

        {/* User Info */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Name</label>
              <p className="text-lg">{user.fullName || user.firstName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <p className="text-lg">
                {user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Subscription</h2>
          
          {hasActiveSubscription ? (
            <div>
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg mb-4">
                  <span className="text-emerald-400 font-semibold">✓ Active Subscription</span>
                </div>
                <p className="text-slate-400">
                  You have an active subscription. You can manage your subscription, update payment methods, 
                  view invoices, or cancel anytime.
                </p>
              </div>
              
              <button
                onClick={handleManageSubscription}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Manage Subscription
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg mb-4">
                  <span className="text-slate-400 font-semibold">No Active Subscription</span>
                </div>
                <p className="text-slate-400">
                  You don't have an active subscription. Subscribe to start submitting visualization requests.
                </p>
              </div>
              
              <button
                onClick={() => router.push('/pricing')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                View Pricing Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
