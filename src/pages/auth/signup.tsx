import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await authApi.signUp(email, password)
      if (error) throw error
      navigate('/login')
      toast({
        title: "Registro exitoso",
        description: "Por favor verifica tu correo electrónico para continuar"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: "No se pudo crear la cuenta"
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
          <h1 className="text-2xl font-semibold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-500">Ingresa tus datos para registrarte</p>
        </div>

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

          <Button
            type="submit"
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Crear cuenta
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
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-orange-500 hover:text-orange-600">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  )
} 