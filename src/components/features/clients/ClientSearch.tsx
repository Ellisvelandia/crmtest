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
} from '../../../components/ui/select'
import { supabase } from '../../../lib/supabase/config'

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
        
      // Apply search filter based on selected field
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
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 backdrop-blur-sm backdrop-filter">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Client Search</h2>
          <p className="text-gray-500">Search for clients using different criteria</p>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-48">
              <Select
                value={searchField}
                onValueChange={setSearchField}
              >
                <SelectTrigger className="bg-white border-2 border-gray-200 hover:border-indigo-500 transition-colors shadow-sm">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg rounded-lg min-w-[200px] z-50">
                  <div className="p-2">
                    <SelectItem value="customer_id" className="rounded-md cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 py-2 px-3 outline-none">
                      <span className="flex items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"></span>
                        <span className="font-medium">Customer ID</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="name" className="rounded-md cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 py-2 px-3 outline-none">
                      <span className="flex items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
                        <span className="font-medium">Name</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="email" className="rounded-md cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 py-2 px-3 outline-none">
                      <span className="flex items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-purple-500 mr-2"></span>
                        <span className="font-medium">Email</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="phone" className="rounded-md cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 py-2 px-3 outline-none">
                      <span className="flex items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"></span>
                        <span className="font-medium">Phone</span>
                      </span>
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search by ${searchField.replace('_', ' ')}...`}
                className="pl-12 h-11 bg-white border-2 border-gray-200 hover:border-indigo-500 transition-colors shadow-sm text-base"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-11 px-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {clients.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Search Results <span className="text-sm text-gray-500 font-normal">({clients.length} found)</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr 
                    key={client.customer_id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800 border border-blue-100">
                        {client.customer_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {client.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleQuickAccess(client)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {clients.length === 0 && searchQuery && !isLoading && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-gray-50 p-6 mb-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 21a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Results Found
            </h3>
            <p className="text-gray-500">
              No clients found matching your search criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 