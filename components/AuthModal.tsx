'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from './Logo'

export function AuthModal() {
    const { isModalOpen, setModalOpen, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [needsConfirmation, setNeedsConfirmation] = useState(false)
    const emailInputRef = useRef<HTMLInputElement>(null)

    // Auto-focus on open
    useEffect(() => {
        if (isModalOpen) {
            setTimeout(() => emailInputRef.current?.focus(), 100)
        }
    }, [isModalOpen])

    if (!isModalOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            if (activeTab === 'login') {
                await signInWithEmail(email, password)
                setModalOpen(false)
            } else {
                await signUpWithEmail(email, password, fullName, username)
                setNeedsConfirmation(true)
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
        } catch (err: any) {
            setError(err.message || 'Google login failed')
        }
    }

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
        >
            <div
                className="relative w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                    <X size={18} />
                </button>

                <div className="p-10 flex flex-col items-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <Logo width={42} height={42} className="scale-110" />
                    </div>

                    {needsConfirmation ? (
                        <div className="w-full py-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Почти готово!</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mb-8 font-medium">
                                Мы отправили письмо для подтверждения на <span className="text-gray-900 font-bold">{email}</span>. Пожалуйста, проверьте вашу почту.
                            </p>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-full py-4 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                Понятно
                            </button>
                            <button
                                onClick={() => setNeedsConfirmation(false)}
                                className="mt-6 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Вернуться назад
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Tabs */}
                            <div className="flex p-1 mb-8 bg-gray-100 rounded-2xl w-full max-w-[340px]">
                                <button
                                    onClick={() => setActiveTab('login')}
                                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Вход
                                </button>
                                <button
                                    onClick={() => setActiveTab('register')}
                                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Регистрация
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="w-full space-y-4 px-2">
                                {activeTab === 'register' && (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Имя или название"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-900"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        ref={emailInputRef}
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-900"
                                        required
                                    />
                                </div>

                                {activeTab === 'register' && (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="@login"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-900"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-900"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {activeTab === 'register' && (
                                    <div className="flex items-start gap-3 pt-2">
                                        <input type="checkbox" className="mt-1 w-4 h-4 rounded-md accent-blue-600" />
                                        <p className="text-[11px] text-gray-400 leading-tight">
                                            Согласен получать еженедельную подборку лучших постов за неделю, иногда рекламу и другие письма
                                        </p>
                                    </div>
                                )}

                                {error && <p className="text-xs text-red-500 text-center font-bold px-2">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button className="text-[13px] font-medium text-gray-600">
                                    Забыли пароль? <span className="text-gray-900 font-bold hover:underline cursor-pointer ml-1">Восстановить</span>
                                </button>
                            </div>

                            {/* Social Login */}
                            <div className="mt-8 flex justify-center w-full">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md transition-all active:scale-90"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Footer Info */}
                            <p className="mt-8 text-[11px] text-center text-gray-400 font-medium leading-relaxed max-w-[320px]">
                                Авторизуясь, вы соглашаетесь с <a href="#" className="text-blue-500 hover:underline">Условиями пользования</a> и <a href="#" className="text-blue-500 hover:underline border-b-0">Политикой конфиденциальности</a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
