'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Client } from '../../types'
import { clientsApi } from '../../lib/api/clients'

const ClientDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Client>>({})

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await clientsApi.searchByCustomerId(id!)
        setClient(data)
        if (data) {
          setFormData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load client')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchClient()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client?.id) return

    try {
      const updatedClient = await clientsApi.updateClient(client.id, formData)
      setClient(updatedClient)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client')
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/clients')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Volver a Clientes
        </button>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="mb-4">Cliente no encontrado</div>
        <button
          onClick={() => navigate('/clients')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Volver a Clientes
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Detalles del Cliente</h1>
          <button
            onClick={() => navigate('/clients')}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← Volver a Clientes
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-8">Ver y administrar información del cliente</p>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-medium text-gray-900">Editar Información del Cliente</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth instanceof Date ? formData.date_of_birth.toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            {/* Client Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-base font-medium text-gray-900">
                      {client.first_name.toLowerCase()} {client.last_name.toLowerCase()}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Cliente desde {new Date(client.created_at).toLocaleDateString('es-ES', { 
                        day: 'numeric',
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#e5f5ef] text-emerald-600 text-xs font-medium rounded-full">
                  Cliente Activo
                </span>
              </div>

              {/* Client Details Grid */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="relative">
                    <p className="text-sm font-medium text-gray-500 mb-2">ID de Cliente</p>
                    <p className="text-sm text-gray-900 pb-2 border-b border-gray-100 hover:border-emerald-100 transition-colors group">
                      <span className="font-medium">{client.customer_id}</span>
                      <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-emerald-100 group-hover:w-full transition-all duration-300"></span>
                    </p>
                  </div>
                  <div className="relative">
                    <p className="text-sm font-medium text-gray-500 mb-2">Correo Electrónico</p>
                    <p className="text-sm text-gray-900 pb-2 border-b border-gray-100 hover:border-emerald-100 transition-colors group">
                      <span className="font-medium">{client.email}</span>
                      <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-emerald-100 group-hover:w-full transition-all duration-300"></span>
                    </p>
                  </div>
                  <div className="relative">
                    <p className="text-sm font-medium text-gray-500 mb-2">Teléfono</p>
                    <p className="text-sm text-gray-900 pb-2 border-b border-gray-100 hover:border-emerald-100 transition-colors group">
                      <span className="font-medium">{client.phone}</span>
                      <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-emerald-100 group-hover:w-full transition-all duration-300"></span>
                    </p>
                  </div>
                  <div className="relative">
                    <p className="text-sm font-medium text-gray-500 mb-2">Fecha de Nacimiento</p>
                    <p className="text-sm text-gray-900 pb-2 border-b border-gray-100 hover:border-emerald-100 transition-colors group">
                      <span className="font-medium">
                        {new Date(client.date_of_birth).toLocaleDateString('es-ES')}
                      </span>
                      <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-emerald-100 group-hover:w-full transition-all duration-300"></span>
                    </p>
                  </div>
                  <div className="md:col-span-2 relative">
                    <p className="text-sm font-medium text-gray-500 mb-2">Dirección</p>
                    <p className="text-sm text-gray-900 pb-2 border-b border-gray-100 hover:border-emerald-100 transition-colors group">
                      <span className="font-medium">{client.address}</span>
                      <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-emerald-100 group-hover:w-full transition-all duration-300"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar Cliente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ClientDetailsPage 