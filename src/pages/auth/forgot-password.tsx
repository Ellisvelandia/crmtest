import { useState } from 'react'
import { authApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authApi.resetPassword(email)
      setSent(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al enviar el correo",
        description: "No se pudo enviar el correo de restablecimiento"
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
          <h1 className="text-2xl font-semibold text-gray-900">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-500">Ingresa tu correo electrónico para restablecerla</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Icons.sparkles className="h-5 w-5 text-green-500" />
                <p className="text-green-700">Hemos enviado un correo con las instrucciones para restablecer tu contraseña.</p>
              </div>
            </div>
            <div className="text-center">
              <a href="/login" className="text-orange-500 hover:text-orange-600">
                Volver al inicio de sesión
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Enviar instrucciones
            </Button>

            <div className="text-center">
              <a href="/login" className="text-orange-500 hover:text-orange-600">
                Volver al inicio de sesión
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 