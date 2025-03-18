import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client } from '../../../types'
import { clientsApi } from '../../../lib/api/clients'

interface ClientSearchProps {
  onClientFound?: (client: Client) => void
  showQuickAccess?: boolean
}

export const ClientSearch: FC<ClientSearchProps> = ({ 
  onClientFound,
  showQuickAccess = true 
}) => {
  const navigate = useNavigate()
  const [searchId, setSearchId] = useState('')
  const [recentSearches, setRecentSearches] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      const client = await clientsApi.searchByCustomerId(searchId)
      if (client) {
        onClientFound?.(client)
        // Add to recent searches if not already present
        setRecentSearches(prev => {
          const filtered = prev.filter(c => c.customer_id !== client.customer_id)
          return [client, ...filtered].slice(0, 5) // Keep last 5 searches
        })
      } else {
        setError('Client not found')
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
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label 
            htmlFor="customerId" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="customerId"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter customer ID"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      {showQuickAccess && recentSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
          <div className="bg-white rounded-md shadow divide-y">
            {recentSearches.map(client => (
              <button
                key={client.customer_id}
                onClick={() => handleQuickAccess(client)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {client.customer_id}
                  </p>
                </div>
                <span className="text-indigo-600">View Profile →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 