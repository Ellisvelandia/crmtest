import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables')
}

// Singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null

// Initialize Supabase client with error handling
const getSupabaseClient = (): SupabaseClient<Database> => {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'zafiro-crm'
      }
    }
  })

  // Test the connection
  supabaseInstance.auth.onAuthStateChange((event, session) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase auth event:', event)
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email)
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }
    }
  })

  return supabaseInstance
}

// Export a single instance
export const supabase = getSupabaseClient()

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error)
  return error?.message || 'An unexpected error occurred'
} 