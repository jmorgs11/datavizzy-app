'use client'

import { useUser } from '@clerk/nextjs'
import { ArrowRight, Upload, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitRequestPage() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    dataType: ''
  })

  useEffect(() => {
    // Check if user has active subscription
    const checkSubscription = async () => {
      if (!isSignedIn) {
        setCheckingSubscription(false)
        return
      }

      try {
        const response = await fetch('/api/check-subscription')
        const data = await response.json()
        setHasActiveSubscription(data.hasActiveSubscription)
      } catch (error) {
        console.error('Error checking subscription:', error)
        setHasActiveSubscription(false)
      } finally {
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [isSignedIn])

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

  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Checking subscription status...</p>
        </div>
      </div>
    )
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-3xl font-bold mb-4">No Active Subscription</h2>
            <p className="text-slate-400 mb-6">
              You need an active subscription to submit visualization requests. 
              Choose a plan to get started!
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all"
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
      
      if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        alert('Please upload only CSV or Excel files (.csv, .xlsx, .xls)')
        return
      }
      
      setFile(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      alert('Please upload a data file (CSV or Excel)')
      return
    }
    
    setLoading(true)

    try {
      // Convert file to base64
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestForm,
          userId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.fullName || user.firstName || 'User',
          file: {
            name: file.name,
            type: file.type,
            data: fileBase64
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Request submitted successfully! We\'ll get back to you within 24-48 hours at ' + user.primaryEmailAddress?.emailAddress)
        setRequestForm({ title: '', description: '', dataType: '' })
        setFile(null)
      } else {
        alert(data.error || 'Something went wrong. Please try again.')
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
            <div className="mt-4 inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg">
              <span className="text-emerald-400 font-semibold">✓ Active Subscription</span>
            </div>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Project Title *</label>
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
              <label className="block text-sm font-medium mb-2 text-slate-300">Data Type *</label>
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
              <label className="block text-sm font-medium mb-2 text-slate-300">Upload Data File (CSV or Excel) *</label>
              
              {!file ? (
                <label className="w-full cursor-pointer">
                  <div className="w-full px-4 py-8 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl hover:border-emerald-500 transition-colors flex flex-col items-center justify-center gap-3">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <div className="text-center">
                      <p className="text-white font-medium">Click to upload file</p>
                      <p className="text-sm text-slate-400 mt-1">CSV, XLSX, or XLS (Max 10MB)</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="w-full px-4 py-4 bg-slate-800 border border-emerald-500 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Description *</label>
              <textarea
                value={requestForm.description}
                onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white h-32 resize-none"
                placeholder="Describe what you need visualized, any specific requirements, and how you plan to use it..."
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
