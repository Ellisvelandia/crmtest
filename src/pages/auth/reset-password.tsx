import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
import { Gem } from "lucide-react"
import { supabase } from '@/lib/supabase/config'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Check if user is authenticated for password reset
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al verificar la sesión."
        })
        navigate('/forgot-password')
        return
      }

      if (!session) {
        toast({
          variant: "destructive",
          title: "Sesión inválida",
          description: "Tu sesión ha expirado. Por favor solicita un nuevo enlace."
        })
        navigate('/forgot-password')
      }
    }

    checkSession()
  }, [navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      // Sign out after password change
      await supabase.auth.signOut()

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente. Por favor inicia sesión con tu nueva contraseña."
      })
      
      navigate('/login')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al restablecer la contraseña",
        description: error instanceof Error ? error.message : "Ha ocurrido un error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2">
            <Gem className="h-8 w-8 text-[#008F5D]" />
            <span className="text-2xl font-semibold text-[#008F5D]">Zafiro</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Restablecer contraseña</h1>
            <p className="text-gray-500">Ingresa tu nueva contraseña para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 px-4 border-gray-200 focus:border-[#008F5D] focus:ring-[#008F5D] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 px-4 border-gray-200 focus:border-[#008F5D] focus:ring-[#008F5D] transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#008F5D] hover:bg-emerald-700 text-white font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Restablecer contraseña
          </Button>

          <div className="text-center">
            <a 
              href="/login" 
              className="text-[#008F5D] hover:text-emerald-700 text-sm font-medium transition-colors"
            >
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  )
} 