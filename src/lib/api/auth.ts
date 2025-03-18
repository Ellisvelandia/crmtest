import { supabase } from '../supabase/config'
import type { AuthError, User } from '@supabase/supabase-js'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

export const authApi = {
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting current user:', error)
        return null
      }
      return user
    } catch (error) {
      console.error('Unexpected error getting current user:', error)
      return null
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        console.error('Sign up error:', error)
        return { user: null, error }
      }
      return { 
        user, 
        error: null 
      }
    } catch (error) {
      console.error('Unexpected sign up error:', error)
      return { user: null, error: error as AuthError }
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error('Sign in error:', error)
        return { user: null, error }
      }
      return { user, error: null }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { user: null, error: error as AuthError }
    }
  },

  // Sign in with Google
  signInWithGoogle: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      if (error) {
        console.error('Google sign in error:', error)
        throw error
      }
    } catch (error) {
      console.error('Unexpected Google sign in error:', error)
      throw error
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      throw error
    }
  },

  // Reset password
  resetPassword: async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) {
        console.error('Reset password error:', error)
        throw error
      }
    } catch (error) {
      console.error('Unexpected reset password error:', error)
      throw error
    }
  },

  // Resend confirmation email
  resendConfirmationEmail: async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error resending confirmation email:', error)
      return { error: error as AuthError }
    }
  },

  // Check if user is admin
  isAdmin: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_admin')
      if (error) throw error
      return !!data
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
} 