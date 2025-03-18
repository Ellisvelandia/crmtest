import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)

  const handleResendConfirmation = async () => {
    if (!email) return
    setIsResendingEmail(true)
    try {
      const { error } = await authApi.resendConfirmationEmail(email)
      if (error) throw error
      toast({
        title: "Email enviado",
        description: "Se ha enviado un nuevo correo de confirmación. Por favor revisa tu bandeja de entrada.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo de confirmación. Por favor intenta nuevamente."
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNeedsEmailConfirmation(false)

    try {
      const { user, error } = await authApi.signIn(email, password)
      
      if (error) {
        if (error.message === 'Email not confirmed') {
          setNeedsEmailConfirmation(true)
          toast({
            title: "Email no confirmado",
            description: "Por favor confirma tu correo electrónico para continuar.",
          })
          return
        }
        throw error
      }

      if (user) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        navigate('/dashboard')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Correo electrónico o contraseña incorrectos"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await authApi.signInWithGoogle()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "No se pudo iniciar sesión con Google"
      })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Icons.sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Iniciar sesión</h1>
          <p className="text-gray-500">Bienvenido de nuevo</p>
        </div>

        {needsEmailConfirmation && (
          <Alert className="bg-orange-50 border-orange-200">
            <Icons.mail className="h-4 w-4 text-orange-500" />
            <AlertTitle>Confirma tu correo electrónico</AlertTitle>
            <AlertDescription className="mt-2">
              <p>Hemos enviado un correo de confirmación a <strong>{email}</strong>.</p>
              <Button
                variant="outline"
                className="mt-2 text-orange-500 border-orange-200 hover:bg-orange-50"
                onClick={handleResendConfirmation}
                disabled={isResendingEmail}
              >
                {isResendingEmail ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Icons.mail className="mr-2 h-4 w-4" />
                    Reenviar correo
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

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

          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 px-4 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-200 text-orange-500 focus:ring-orange-500"
              />
              <Label htmlFor="remember" className="text-sm text-gray-500">Recordar por 30 días</Label>
            </div>
            <a href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Iniciar sesión
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O continuar con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 border-gray-200 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
            >
              <Icons.google className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 border-gray-200 hover:bg-gray-50"
            >
              <Icons.facebook className="h-5 w-5 text-blue-600" />
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <a href="/signup" className="text-orange-500 hover:text-orange-600">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  )
} 