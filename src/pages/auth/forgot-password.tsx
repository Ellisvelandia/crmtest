import { useState } from 'react'
import { authApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Icons.zafiro className="h-10 w-10 text-purple-600" />
            <h1 className="text-3xl font-bold">¿Olvidaste tu contraseña?</h1>
            <p className="text-gray-500">Ingresa tu correo electrónico para restablecerla</p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-green-700">
                Hemos enviado un correo con las instrucciones para restablecer tu contraseña.
              </div>
              <div className="text-center">
                <a href="/login" className="text-sm text-purple-600 hover:underline">
                  Volver al inicio de sesión
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Enviar instrucciones
              </Button>

              <div className="text-center">
                <a href="/login" className="text-sm text-purple-600 hover:underline">
                  Volver al inicio de sesión
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 