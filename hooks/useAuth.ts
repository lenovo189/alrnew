'use client'

import { useAuth as useAuthContext } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
    const context = useAuthContext()

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        })
        if (error) throw error
    }

    const signInWithEmail = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        })
        if (error) throw error
    }

    const signUpWithEmail = async (email: string, pass: string, fullName?: string, username?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    full_name: fullName,
                    username: username,
                }
            }
        })
        if (error) throw error
    }

    const updateProfile = async (data: {
        full_name?: string
        username?: string
        avatar_url?: string
        bio?: string
    }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase
            .from('profiles')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', user.id)

        if (error) throw error
        await context.refreshProfile()
    }

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error
    }

    return {
        ...context,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        updateProfile,
        updatePassword,
    }
}
