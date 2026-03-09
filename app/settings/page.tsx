'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/Logo'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    User,
    Lock,
    Camera,
    Check,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
    Trash2,
} from 'lucide-react'

// ─── Reusable field ────────────────────────────────────────────────────────────
function Field({
    label,
    hint,
    children,
}: {
    label: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-text-muted px-1">
                {label}
            </label>
            {children}
            {hint && <p className="text-[11px] text-text-muted/60 font-medium px-1">{hint}</p>}
        </div>
    )
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({
    message,
    type,
    onDismiss,
}: {
    message: string
    type: 'success' | 'error'
    onDismiss: () => void
}) {
    useEffect(() => {
        const t = setTimeout(onDismiss, 3500)
        return () => clearTimeout(t)
    }, [onDismiss])

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold animate-in slide-in-from-bottom-4 duration-300 ${type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
                }`}
        >
            {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {message}
        </div>
    )
}

// ─── Section card wrapper ──────────────────────────────────────────────────────
function Section({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode
    title: string
    children: React.ReactNode
}) {
    return (
        <section className="bg-surface border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-8 py-5 border-b border-border/50 bg-background/40">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-base font-black tracking-tight">{title}</h2>
            </div>
            <div className="px-8 py-6 space-y-6">{children}</div>
        </section>
    )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
    const router = useRouter()
    const { user, profile, loading: authLoading, updateProfile, updatePassword } = useAuth()

    // Profile fields
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [profileLoading, setProfileLoading] = useState(false)

    // Password fields
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    // UI
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Seed form from profile once loaded
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '')
            setUsername(profile.username || '')
            setBio(profile.bio || '')
            setAvatarUrl(profile.avatar_url || '')
        }
    }, [profile])

    // Redirect if unauthenticated after auth resolves
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/dashboard')
        }
    }, [authLoading, user, router])

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
    }

    // ── Save profile handler ────────────────────────────────────────────────────
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileLoading(true)
        try {
            await updateProfile({
                full_name: fullName.trim(),
                username: username.trim().replace(/^@/, ''),
                bio: bio.trim(),
                avatar_url: avatarUrl,
            })
            showToast('Profil muvaffaqiyatli saqlandi!', 'success')
        } catch (err: any) {
            showToast(err.message || 'Xatolik yuz berdi', 'error')
        } finally {
            setProfileLoading(false)
        }
    }

    // ── Save password handler ───────────────────────────────────────────────────
    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            showToast('Parollar mos kelmadi', 'error')
            return
        }
        if (newPassword.length < 6) {
            showToast("Parol kamida 6 ta belgidan iborat bo'lishi kerak", 'error')
            return
        }
        setPasswordLoading(true)
        try {
            await updatePassword(newPassword)
            setNewPassword('')
            setConfirmPassword('')
            showToast("Parol muvaffaqiyatli o'zgartirildi!", 'success')
        } catch (err: any) {
            showToast(err.message || 'Xatolik yuz berdi', 'error')
        } finally {
            setPasswordLoading(false)
        }
    }

    // ── Loading guard ───────────────────────────────────────────────────────────
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) return null // redirecting...

    const initials = (fullName || username || user.email || 'U')[0].toUpperCase()

    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-8 border-b border-border/50 bg-background sticky top-0 z-[100]">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-xl text-text-muted hover:text-foreground hover:bg-surface transition-all border border-transparent hover:border-border/50"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <Logo className="h-8" />
                </div>
                <span className="text-sm font-black text-text-muted">Hisob sozlamalari</span>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
                {/* Page title */}
                <div className="space-y-1 px-1">
                    <h1 className="text-3xl font-black tracking-tight">Sozlamalar</h1>
                    <p className="text-text-muted font-medium text-sm">
                        Profil va hisob ma'lumotlaringizni yangilang
                    </p>
                </div>

                {/* ── Avatar Section ── */}
                <Section icon={<Camera size={18} />} title="Profil rasmi">
                    <div className="flex items-center gap-6">
                        {/* Avatar preview */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl font-black text-primary overflow-hidden shadow-sm">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt="Avatar"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                        </div>

                        {/* Upload controls */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-text-muted">
                                JPG, PNG, GIF • Maks. 4 MB
                            </p>
                            <div className="flex items-center gap-2">
                                <UploadButton
                                    endpoint="thumbnailUploader"
                                    onClientUploadComplete={async (res) => {
                                        const url = res[0].url
                                        setAvatarUrl(url)
                                        try {
                                            await updateProfile({ avatar_url: url })
                                            showToast('Rasm yangilandi!', 'success')
                                        } catch (err: any) {
                                            showToast(err.message, 'error')
                                        }
                                    }}
                                    onUploadError={(err) => showToast(err.message, 'error')}
                                    className="ut-button:h-10 ut-button:px-5 ut-button:bg-primary ut-button:text-white ut-button:text-xs ut-button:font-black ut-button:uppercase ut-button:tracking-wide ut-button:rounded-xl ut-button:shadow-sm hover:ut-button:bg-blue-700 ut-allowed-content:hidden"
                                />
                                {avatarUrl && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setAvatarUrl('')
                                            try {
                                                await updateProfile({ avatar_url: '' })
                                                showToast("Rasm o'chirildi", 'success')
                                            } catch (err: any) {
                                                showToast(err.message, 'error')
                                            }
                                        }}
                                        className="h-10 px-4 flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
                                    >
                                        <Trash2 size={14} />
                                        O'chirish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── Public Info Section ── */}
                <Section icon={<User size={18} />} title="Ommaviy ma'lumotlar">
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                        <Field label="To'liq ism" hint="Kurslar va sharhlar ostida ko'rsatiladi">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Masalan: Abdulloh Karimov"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40"
                            />
                        </Field>

                        <Field label="Foydalanuvchi nomi" hint="Unikal @login — boshqa foydalanuvchilar sizi shu orqali topadi">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-black text-sm select-none">
                                    @
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())
                                    }
                                    placeholder="username"
                                    className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40"
                                />
                            </div>
                        </Field>

                        <Field label="Bio" hint="Maksimal 200 belgi">
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                                rows={3}
                                placeholder="O'zingiz haqida qisqacha..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40 resize-none"
                            />
                            <p className="text-[11px] text-text-muted/40 font-medium px-1 -mt-1 text-right">
                                {bio.length}/200
                            </p>
                        </Field>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="h-12 px-8 bg-primary text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2"
                            >
                                {profileLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saqlanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Profilni saqlash
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Section>

                {/* ── Account Section ── */}
                <Section icon={<Lock size={18} />} title="Hisob xavfsizligi">
                    {/* Email — read only */}
                    <Field label="Email manzil" hint="Email ni o'zgartirish uchun qo'llab-quvvatlash xizmatiga murojaat qiling">
                        <div className="w-full bg-surface/60 border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-muted cursor-not-allowed select-none">
                            {user.email}
                        </div>
                    </Field>

                    {/* Divider */}
                    <div className="border-t border-border/40 pt-2" />

                    {/* Password */}
                    <form onSubmit={handleSavePassword} className="space-y-5">
                        <Field label="Yangi parol">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Kamida 6 ta belgi"
                                    className="w-full bg-background border border-border rounded-xl px-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </Field>

                        <Field label="Parolni tasdiqlang">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Parolni qayta kiriting"
                                className={`w-full bg-background border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted/40 ${confirmPassword && newPassword !== confirmPassword
                                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                                    : confirmPassword && newPassword === confirmPassword
                                        ? 'border-green-300 focus:ring-green-500/20 focus:border-green-400'
                                        : 'border-border focus:ring-primary/20 focus:border-primary'
                                    }`}
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-[11px] text-red-500 font-bold px-1">Parollar mos kelmadi</p>
                            )}
                        </Field>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={passwordLoading || !newPassword}
                                className="h-12 px-8 bg-foreground text-background rounded-xl font-bold text-sm hover:opacity-80 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 flex items-center gap-2"
                            >
                                {passwordLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saqlanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} />
                                        Parolni o'zgartirish
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Section>

                {/* Danger zone: sign-out shortcut */}
                <div className="flex items-center justify-center py-4">
                    <Link
                        href="/dashboard"
                        className="text-sm font-bold text-text-muted hover:text-foreground transition-colors"
                    >
                        ← Bosh sahifaga qaytish
                    </Link>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    )
}
