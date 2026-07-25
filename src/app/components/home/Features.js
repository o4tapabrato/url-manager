export default function Features() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-900 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Built for speed and control</h2>
          <p className="text-slate-400">Everything you need to manage your links like a pro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl backdrop-blur">
            <div className="w-12 h-12 bg-indigo-950 border border-indigo-800/50 rounded-xl flex items-center justify-center text-indigo-400 mb-6 font-bold text-xl">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Redirection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by high-performance caching layers to ensure visitors hit your target URL in milliseconds without lag.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl backdrop-blur">
            <div className="w-12 h-12 bg-cyan-950 border border-cyan-800/50 rounded-xl flex items-center justify-center text-cyan-400 mb-6 font-bold text-xl">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Deep Click Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gain insights into your audience. Track geographic locations, device breakdown, and total traffic volumes.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl backdrop-blur">
            <div className="w-12 h-12 bg-purple-950 border border-purple-800/50 rounded-xl flex items-center justify-center text-purple-400 mb-6 font-bold text-xl">🔗</div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom Slugs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ditch random character strings. Craft branded, memorable custom short paths for campaigns and social sharing.
            </p>
          </div>
        </div>
      </section>
    )
}