export default function WorkPage() {
  const projects = [
    {
      title: 'E-commerce Sales Dashboard',
      category: 'Dashboard',
      description: 'Real-time analytics dashboard tracking revenue, customer behavior, and product performance.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Climate Data Visualization',
      category: 'Infographic',
      description: 'Interactive climate change visualization showing temperature trends over the past century.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Financial Portfolio Tracker',
      category: 'Interactive Chart',
      description: 'Dynamic portfolio performance tracker with drill-down capabilities and trend analysis.',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      title: 'Healthcare Analytics Platform',
      category: 'Dashboard',
      description: 'Comprehensive patient data visualization for medical professionals.',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Social Media Metrics',
      category: 'Report',
      description: 'Engagement and growth metrics visualized for marketing teams.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Supply Chain Optimization',
      category: 'Interactive Chart',
      description: 'Complex logistics data transformed into actionable insights.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Work</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            See how we've helped businesses transform their data into compelling visual stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all transform hover:-translate-y-2"
            >
              <div className={`h-48 bg-gradient-to-br ${project.gradient} relative`}>
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all" />
              </div>
              <div className="p-6">
                <div className="text-sm text-emerald-400 font-semibold mb-2">{project.category}</div>
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-slate-400">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
