'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(registered ? 'Account created successfully! Login now' : '');

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid username or password !!!');
            }
            //redirecting to dashboard
            router.push('/dashboard');
        }
        catch (error) {
            setErrorMessage(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">

            {/* Header / Logo */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="inline-flex items-center space-x-2 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
                        S
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight">Link<span className="text-indigo-400">Snip</span></span>
                </Link>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
                        Create account
                    </Link>
                </p>
            </div>

            {/* Form Card */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-slate-900/60 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl backdrop-blur sm:px-10">

                    {/* Success Banner */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs rounded-xl">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-xl">
                            {errorMessage}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span>Signing in...</span>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    )
}