import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/config'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the URL fragment (everything after #)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')
        const type = hashParams.get('type')
        const accessToken = hashParams.get('access_token')

        // Handle errors first
        if (error) {
          toast({
            variant: "destructive",
            title: "Error de verificación",
            description: errorDescription || "El enlace ha expirado o es inválido. Por favor solicita uno nuevo."
          })
          navigate('/auth/forgot-password')
          return
        }

        // If this is a recovery (password reset) flow
        if (type === 'recovery' && accessToken) {
          // Set the session with the access token
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          })

          if (sessionError) throw sessionError

          // Redirect to reset password page
          navigate('/auth/reset-password')
          return
        }

        // For other auth flows (sign in, sign up)
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        toast({
          variant: "destructive",
          title: "Error de verificación",
          description: "Ha ocurrido un error. Por favor intenta nuevamente."
        })
        navigate('/auth/forgot-password')
      }
    }

    handleCallback()
  }, [navigate, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-800 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <Icons.spinner className="h-8 w-8 animate-spin mx-auto text-[#008F5D]" />
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