import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client } from '../../../types'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Search, Eye } from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { supabase } from '../../../lib/supabase/config'
import { UserIcon, TextIcon, MailIcon, PhoneIcon, SearchIcon } from 'lucide-react'

interface ClientSearchProps {
  onClientFound?: (client: Client) => void
  showQuickAccess?: boolean
}

export const ClientSearch: FC<ClientSearchProps> = ({ 
  onClientFound,
  showQuickAccess = true 
}) => {
  const navigate = useNavigate()
  const [searchField, setSearchField] = useState('customer_id')
  const [searchQuery, setSearchQuery] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      let query = supabase
        .from('clients')
        .select('*')
        
      if (searchField === 'customer_id') {
        query = query.ilike('customer_id', `%${searchQuery}%`)
      } else if (searchField === 'name') {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
      } else if (searchField === 'email') {
        query = query.ilike('email', `%${searchQuery}%`)
      } else if (searchField === 'phone') {
        query = query.ilike('phone', `%${searchQuery}%`)
      }

      const { data, error: searchError } = await query
        .order('created_at', { ascending: false })
        .limit(10)

      if (searchError) throw searchError

      setClients(data || [])
      if (data && data.length === 1 && onClientFound) {
        onClientFound(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAccess = (client: Client) => {
    navigate(`/clients/${client.customer_id}`)
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-48">
              <Select
                value={searchField}
                onValueChange={setSearchField}
                defaultValue="name"
              >
                <SelectTrigger 
                  className="relative h-10 w-full bg-white border border-gray-200 
                    hover:border-emerald-500 hover:ring-1 hover:ring-emerald-100
                    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                    shadow-sm text-sm rounded-md transition-all duration-200
                    data-[placeholder]:text-gray-500"
                  aria-label="Select search field"
                >
                  <div className="flex items-center gap-2">
                    <SearchIcon className="h-4 w-4 text-gray-500" />
                    <SelectValue 
                      placeholder="Search by" 
                      className="text-gray-700"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-gray-200 shadow-lg rounded-md 
                    min-w-[200px] animate-in fade-in-0 zoom-in-95"
                  position="popper"
                  sideOffset={4}
                >
                  <div 
                    className="p-1 space-y-0.5" 
                    role="listbox" 
                    aria-label="Search field options"
                  >
                    <SelectItem 
                      value="customer_id" 
                      className="rounded-md py-2 px-3 text-sm cursor-pointer
                        hover:bg-emerald-50 hover:text-emerald-700
                        focus:bg-emerald-50 focus:text-emerald-700
                        data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700
                        transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>Client ID</span>
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="name" 
                      className="rounded-md py-2 px-3 text-sm cursor-pointer
                        hover:bg-emerald-50 hover:text-emerald-700
                        focus:bg-emerald-50 focus:text-emerald-700
                        data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700
                        transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2">
                        <TextIcon className="h-4 w-4" />
                        <span>Name</span>
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="email" 
                      className="rounded-md py-2 px-3 text-sm cursor-pointer
                        hover:bg-emerald-50 hover:text-emerald-700
                        focus:bg-emerald-50 focus:text-emerald-700
                        data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700
                        transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="phone" 
                      className="rounded-md py-2 px-3 text-sm cursor-pointer
                        hover:bg-emerald-50 hover:text-emerald-700
                        focus:bg-emerald-50 focus:text-emerald-700
                        data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700
                        transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>Phone</span>
                      </div>
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar por ${searchField === 'customer_id' ? 'ID de cliente' : 
                  searchField === 'name' ? 'nombre' : 
                  searchField === 'email' ? 'correo electrónico' : 
                  'teléfono'}...`}
                className="w-full h-10 pl-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mx-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {clients.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="px-6 py-4 bg-emerald-50/50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">
              Resultados de Búsqueda <span className="text-emerald-600 font-normal">({clients.length})</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {clients.map((client) => (
              <div 
                key={client.customer_id}
                className="px-6 py-4 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        {client.customer_id}
                      </span>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {client.first_name} {client.last_name}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center space-x-3">
                      <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-500">{client.phone}</p>
                    </div>
                  </div>
                  {showQuickAccess && (
                    <button
                      onClick={() => handleQuickAccess(client)}
                      className="ml-4 flex-shrink-0 flex items-center text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md px-3 py-1.5 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      Ver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {clients.length === 0 && searchQuery && !isLoading && (
        <div className="px-6 py-12 text-center border-t border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-4">
            <Search className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No Se Encontraron Resultados
          </h3>
          <p className="text-sm text-emerald-600">
            Intenta ajustar tus criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  )
} 