import Link from "next/link"

export default function HeroSection() {
    return (
        <main className="max-w-5xl mx-auto px-6 pt-12 pb-16 text-center my-auto">
        <div className="inline-flex items-center space-x-2 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full text-indigo-300 text-xs font-medium mb-6">
          <span>✨ Lightning fast redirects & deep analytics</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Simplify your links, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">amplify your reach.</span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Create clean custom slugs, track real-time click metrics, and route your audience intelligently—all in one developer-friendly dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/30 text-center">
            Create Free Account
          </Link>
          <Link href="/login" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition text-center">
            Sign In to Dashboard
          </Link>
        </div>
      </main>
    )
}