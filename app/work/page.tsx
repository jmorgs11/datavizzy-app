import Image from 'next/image'

export default function WorkPage() {
  const projects = [
    {
      title: 'Correlation & Trend Analysis',
      image: '/images/scatter-plot.png',
      category: 'Trend Analysis',
      request: 'Build a colorful scatter plot with a trend line showing the relationship between two key metrics, with bubble sizing to represent volume and clear visual hierarchy.',
      description: 'Interactive scatter plot with weighted bubbles and linear regression line, perfect for presenting year-over-year trends and identifying correlations in business metrics.'
    },
    {
      title: 'Labeled & Clustered Scatter',
      image: '/images/regions-plot.png',
      category: 'Labeling Data Points',
      request: 'Plot my data points, labeling each point. Draw a border in the top left and bottom right of the graph based on the attachment',
      description: 'Custom scatter plot with annotated regions, helping stakeholders quickly identify high-performing vs. underperforming segments with color-coded trend boundaries.'
    },
    {
      title: 'Distribution Comparison',
      image: '/images/violin-plot.png',
      category: 'Visualizing Distributions',
      request: 'Design a box plot / violin plot to compare distribution patterns across multiple groups, showing both the density and quartile information.',
      description: 'Advanced violin plot visualization showcasing data distributions across four categories with color-coded density curves and embedded box plots for comprehensive statistical insight.'
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Work</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real examples of data visualizations we've created for our clients. From statistical analysis to trend reporting, we transform complex data into clear insights.
          </p>
        </div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 group-hover:border-emerald-500/50 transition-all transform group-hover:scale-[1.02]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg">
                  <span className="text-emerald-400 font-semibold text-sm">{project.category}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">{project.title}</h2>
                
                {/* Client Request Callout */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-cyan-400 p-6 rounded-lg">
                  <p className="text-sm text-cyan-400 font-semibold mb-2">CLIENT REQUEST</p>
                  <p className="text-slate-300 italic">"{project.request}"</p>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-2xl border border-emerald-500/20">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Whether you need statistical analysis, trend visualizations, or custom dashboards, 
              we'll create publication-ready visuals tailored to your needs.
            </p>
            <a
              href="/pricing"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
