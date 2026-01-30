import Link from 'next/link'
import { BarChart3, Zap, Award, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Transform Your Data Into
            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Stunning Visuals
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Professional data visualization services that turn complex datasets into clear, compelling stories. 
            Let us handle the complexity while you focus on insights.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/work"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-slate-400">
              Get your visualizations delivered within 24-48 hours. No lengthy back-and-forth, just results.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Expert Design</h3>
            <p className="text-slate-400">
              Our team specializes in creating beautiful, publication-ready charts and dashboards.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Unlimited Revisions</h3>
            <p className="text-slate-400">
              Not happy? We'll revise until it's perfect. Your satisfaction is guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
