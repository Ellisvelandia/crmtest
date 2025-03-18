import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/config'
import { Icons } from '@/components/ui/icons'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle the authentication callback
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard')
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <Icons.spinner className="h-8 w-8 animate-spin mx-auto text-purple-600" />
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Verificando tu identidad...
        </h1>
        <p className="mt-2 text-gray-600">
          Por favor espera mientras te redirigimos.
        </p>
      </div>
    </div>
  )
} 