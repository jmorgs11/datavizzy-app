'use client'

import { useUser } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitRequestPage() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    deadline: '',
    dataType: ''
  })

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-6">You need to be signed in to submit a request.</p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all"
          >
            View Pricing
          </button>
        </div>
      </div>
    )
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestForm,
          userId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress
        }),
      })

      if (response.ok) {
        alert('Request submitted successfully! We\'ll get back to you within 24 hours.')
        setRequestForm({ title: '', description: '', deadline: '', dataType: '' })
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-emerald-500/20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Submit a Request</h2>
            <p className="text-slate-400">Tell us about your visualization needs</p>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Project Title</label>
              <input
                type="text"
                value={requestForm.title}
                onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white"
                placeholder="e.g., Q4 Sales Dashboard"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Data Type</label>
              <select
                value={requestForm.dataType}
                onChange={(e) => setRequestForm({ ...requestForm, dataType: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white"
                required
              >
                <option value="">Select data type...</option>
                <option value="sales">Sales & Revenue</option>
                <option value="marketing">Marketing Analytics</option>
                <option value="financial">Financial Data</option>
                <option value="operational">Operational Metrics</option>
                <option value="customer">Customer Data</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Description</label>
              <textarea
                value={requestForm.description}
                onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white h-32 resize-none"
                placeholder="Describe what you need visualized, any specific requirements, and how you plan to use it..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Deadline</label>
              <input
                type="date"
                value={requestForm.deadline}
                onChange={(e) => setRequestForm({ ...requestForm, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
