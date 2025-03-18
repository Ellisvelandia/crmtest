import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden')
      }

      // TODO: Implement password reset logic with Supabase
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Icons.sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Restablecer contraseña</h1>
          <p className="text-gray-500">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 px-4 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 px-4 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Restablecer contraseña
          </Button>

          <div className="text-center">
            <a href="/login" className="text-orange-500 hover:text-orange-600">
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  )
} 