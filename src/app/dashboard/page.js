'use client'

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QRCodeCanvas } from "qrcode.react"

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [baseUrl, setBaseUrl] = useState('');
    const [originalUrl, setOriginalUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [copiedId, setCopiedId] = useState('');
    const [qrModalUrl, setQrModalUrl] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.host);
        }

        fetch('/api/auth/me').then((res) => {
            if (!res.ok)
                router.push('/login');
            else
                return res.json();
        }
        ).then((data) => {
            if (data && data.user) {
                setUser(user);
            }
        }).catch(() => {
            router.push('/login');
        })
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/links', { method: 'GET' });

                if (!response.ok) {
                    throw new Error("Unable to fetch the links");
                }

                const data = await response.json();

                if (data && Array.isArray(data.links)) {
                    const formattedLinks = data.links.map((link) => ({
                        id: link.id,
                        title: link.shortCode,
                        originalUrl: link.originalUrl,
                        shortCode: link.shortCode,
                        shortUrl: `${window.location.host}/${link.shortCode}`,
                        clicks: link.clicksCount || 0, // <-- Mapped from schema's clicksCount
                        createdAt: link.createdAt ? link.createdAt.split('T')[0] : '',
                    }));
                    setLinks(formattedLinks);
                }
            }
            catch (error) {
                console.log(error);
                setLinks([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyToClipboard = (shortCode, id) => {
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
        const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
        const fullUrl = `${protocol}//${shortCode}`;

        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCreateLink = async (e) => {
        e.preventDefault();
        if (!originalUrl)
            return;

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalUrl,
                    customSlug: customSlug || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create short link');
            }

            const newLink = {
                id: data.link.id,
                title: data.link.shortCode,
                originalUrl: data.link.originalUrl,
                shortCode: data.link.shortCode,
                shortUrl: `${baseUrl}/${data.link.shortCode}`,
                clicks: data.link.clicks,
                createdAt: data.link.createdAt.split('T')[0],
            };

            setLinks([newLink, ...links]);
            setOriginalUrl('');
            setCustomSlug('');
        } catch (error) {
            alert(error.message);
        }
    }

    const handleDeleteLink = async (id) => {
        if (!confirm("Are you sure you want to delete this link?"))
            return;

        try {
            const response = await fetch(`/api/links/${id}`, { method: 'DELETE' });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete the link");
            }

            //removing the delted link from the list
            setLinks(links.filter((link) => link.id !== id));
        }
        catch (error) {
            alert(error.message);
        }
    }

    const openQrModal = (shortCode) => {
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
        const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
        const fullUrl = `${protocol}//${shortCode}`;
        setQrModalUrl(fullUrl);
    }

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: 'POST' });
        router.push('/login');
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">

            {/* Top Navbar */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-600/30">
                            S
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">Link<span className="text-indigo-400">Snip</span></span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">Welcome back</p>
                            <p className="text-xs text-indigo-400">Pro Developer Plan</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="max-w-7xl w-full mx-auto px-6 py-10 flex-grow space-y-10">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Links</p>
                        <p className="text-3xl font-bold text-white">{Array.isArray(links) ? links.length : 0}</p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Clicks</p>
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            {Array.isArray(links)
                                ? links.reduce((acc, curr) => acc + (Number(curr.clicks) || 0), 0)
                                : 0}
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Active Domain</p>
                        <p className="text-lg font-medium text-slate-200">linksnip.io</p>
                    </div>
                </div>

                {/* Create Short Link Form */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-2xl backdrop-blur">
                    <h2 className="text-lg font-bold text-white mb-4">Create a New Short Link</h2>
                    <form onSubmit={handleCreateLink} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6">
                            <input
                                type="url"
                                required
                                placeholder="https://example.com/long-url"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <input
                                type="text"
                                placeholder="Custom slug (optional)"
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full h-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-600/30 text-sm cursor-pointer"
                            >
                                Shorten
                            </button>
                        </div>
                    </form>
                </div>

                {/* Links Table Section */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-800">
                        <h3 className="text-lg font-bold text-white">Your Shortened Links</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/40">
                                    <th className="py-4 px-6 font-semibold">Short Link</th>
                                    <th className="py-4 px-6 font-semibold">Original Destination</th>
                                    <th className="py-4 px-6 font-semibold">Clicks</th>
                                    <th className="py-4 px-6 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">

                                {links.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-500">
                                            No links created yet. Shorten your first link above!
                                        </td>
                                    </tr>
                                ) : (
                                    Array.isArray(links) && links.map((link) => (
                                        <tr key={link.id} className="hover:bg-slate-950/30 transition">
                                            <td className="py-4 px-6 font-medium text-indigo-400">
                                                {link.shortUrl}
                                            </td>
                                            <td className="py-4 px-6 text-slate-300 truncate max-w-xs">
                                                {link.originalUrl}
                                            </td>
                                            <td className="py-4 px-6 text-slate-300 font-semibold">
                                                {link.clicks}
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    onClick={() => openQrModal(link.shortCode)}
                                                    className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                                                >
                                                    QR Code
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(link.shortCode, link.id)}
                                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                                                >
                                                    {copiedId === link.id ? 'Copied!' : 'Copy'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLink(link.id)}
                                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* QR Code Modal */}
                {qrModalUrl && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
                            <h3 className="text-lg font-bold text-white">Scan to open on phone</h3>
                            <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                                {/* Import QRCodeCanvas from 'qrcode.react' at the top of your file */}
                                <QRCodeCanvas value={qrModalUrl} size={200} level="H" />
                            </div>
                            <p className="text-xs text-slate-400 break-all">{qrModalUrl}</p>
                            <button
                                onClick={() => setQrModalUrl(null)}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl transition text-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-6 text-center text-slate-500 text-sm mt-auto">
                <p>&copy; 2026 LinkSnip. All rights reserved.</p>
            </footer>

        </div>
    );
}