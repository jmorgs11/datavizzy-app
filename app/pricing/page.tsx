'use client'

import { Check } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

export default function PricingPage() {
  const { isSignedIn } = useUser()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!isSignedIn) {
      alert('Please sign in to subscribe')
      return
    }

    setLoading(planName)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      name: 'Standard',
      price: '$299',
      period: '/month',
      description: 'Perfect for teams that need consistent visualization support',
      features: [
        'Unlimited visualization requests per month',
        '48-hour delivery',
        'Email support'
      ],
      popular: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_standard'
    },
    {
      name: 'Pro',
      price: '$499',
      period: '/month',
      description: 'For teams that need visualization plus deep data analysis',
      features: [
        'Everything in Standard, plus:',
        'Accepts additional data analysis requests',
        'Priority support & delivery'
      ],
      popular: true,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Transparent Pricing</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Unlimited visualizations. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border transition-all transform hover:-translate-y-2 ${
                plan.popular
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 md:scale-105'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.name ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            All plans include unlimited revisions and our satisfaction guarantee
          </p>
        </div>
      </div>
    </div>
  )
}
