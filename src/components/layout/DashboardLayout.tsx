import { useState } from 'react'
import { useNavigate, Link, Outlet } from 'react-router-dom'
import { authApi } from '@/lib/api/auth'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await authApi.signOut()
      navigate('/login')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar sesión. Por favor intenta nuevamente."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        <Icons.menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Icons.sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <span className="text-lg lg:text-xl font-semibold">JOYERÍA EL ZAFIRO</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start text-gray-600" asChild>
              <Link to="/dashboard" className="flex items-center space-x-3">
                <Icons.dashboard className="h-5 w-5" />
                <span>Panel Principal</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600" asChild>
              <Link to="/clients" className="flex items-center space-x-3">
                <Icons.user className="h-5 w-5" />
                <span>Clientes</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600" asChild>
              <Link to="/products" className="flex items-center space-x-3">
                <Icons.tasks className="h-5 w-5" />
                <span>Productos</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600" asChild>
              <Link to="/sales" className="flex items-center space-x-3">
                <Icons.reports className="h-5 w-5" />
                <span>Ventas</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600" 
              onClick={handleLogout}
              disabled={isLoading}
            >
              <Icons.logout className="h-5 w-5 mr-3" />
              <span>Cerrar Sesión</span>
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 