import { useState, useEffect } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import { authApi } from '@/lib/api/auth'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

// Define the navigation link type
type NavLink = {
  path: string
  icon: React.ElementType
  label: string
}

const sidebarLinks: NavLink[] = [
  { path: '/dashboard', icon: Icons.dashboard, label: 'Panel Principal' },
  { path: '/clients', icon: Icons.user, label: 'Clientes' },
  { path: '/products', icon: Icons.tasks, label: 'Productos' },
  { path: '/sales', icon: Icons.reports, label: 'Ventas' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Close sidebar on location change in mobile view
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [location])

  // Close sidebar on window resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-orange-50 to-orange-200 overflow-hidden">
      {/* Mobile header with menu button */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-orange-300 to-orange-200 z-40 border-b border-orange-200 px-4 flex items-center shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-white/20 transition-colors mr-3"
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <Icons.menu className="h-5 w-5 text-gray-800" />
        </button>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-2.5">
            <Icons.sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-base font-semibold text-gray-800">JOYERÍA EL ZAFIRO</h1>
        </div>
      </header>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-[260px] md:w-[280px] bg-gradient-to-b from-orange-200 to-orange-100 transform transition-transform duration-200 ease-in-out lg:transform-none shadow-md",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo - Hidden on mobile since we show it in the header */}
          <div className="py-6 px-6 border-b border-orange-200 hidden lg:block">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                <Icons.sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg text-gray-800 font-semibold">JOYERÍA EL ZAFIRO</h1>
            </div>
          </div>

          {/* Section label */}
          <div className="px-6 pt-6 pb-2">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">MAIN</p>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto py-2">
            <nav className="px-3 space-y-0.5">
              {sidebarLinks.map((link) => (
                <Button 
                  key={link.path}
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start h-10 rounded-md px-3 mb-1",
                    isActive(link.path) 
                      ? "bg-white text-gray-800 hover:bg-white/90 shadow-sm" 
                      : "text-gray-700 hover:bg-white/50 hover:text-gray-900"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsSidebarOpen(false)
                  }}
                  asChild
                >
                  <Link to={link.path} className="flex items-center">
                    <link.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{link.label}</span>
                    {isActive(link.path) && (
                      <div className="ml-auto">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="text-gray-400"
                        >
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </div>
                    )}
                  </Link>
                </Button>
              ))}
            </nav>
            
            {/* Account and Logout Section */}
            <div className="px-3 mt-auto pb-6 border-t border-orange-200 pt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:bg-white/50 hover:text-gray-900 rounded-md h-10" 
                onClick={handleLogout}
                disabled={isLoading}
              >
                <Icons.logout className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Cerrar Sesión</span>
                {isLoading && <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-6 sm:p-8 mt-14 lg:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 