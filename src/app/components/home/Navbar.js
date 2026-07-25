import Link from 'next/link'

export default function Navbar() {
    return (
        <>
        <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">S</div>
          <span className="text-xl font-bold tracking-tight">Link<span className="text-indigo-400">Snip</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition">
            Sign In
          </Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-600/30">
            Get Started
          </Link>
        </div>
      </header>
        </>
    )
}