'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Client } from '../../types'
import { ClientSearch } from '../../components/features/clients/ClientSearch'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase/config'

const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('last_name', { ascending: true })

        if (error) throw error
        setClients(data || [])
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    fetchClients()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="relative">
        {/* Subtle top gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Main Content Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h1>
                <p className="text-sm text-gray-500 mt-1">Administrar y monitorear información de clientes</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  Clientes Activos: {clients.length}
                </span>
              </div>
            </div>

            {/* Search Section */}
            <div className="w-full">
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <ClientSearch 
                  onClientFound={setSelectedClient}
                  showQuickAccess={true}
                />
              </motion.div>
            </div>

            {/* Selected Client Details Card */}
            {selectedClient && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Perfil del Cliente</h2>
                        <p className="text-sm text-gray-500">ID de Referencia: {selectedClient.customer_id}</p>
                      </div>
                      <Link
                        to={`/clients/${selectedClient.customer_id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                      >
                        Ver Detalles
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-50/50 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">Nombre Completo</p>
                        <p className="text-sm text-gray-900">
                          {selectedClient.first_name} {selectedClient.last_name}
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">Correo Electrónico</p>
                        <p className="text-sm text-gray-900 truncate">{selectedClient.email}</p>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">Teléfono</p>
                        <p className="text-sm text-gray-900">{selectedClient.phone}</p>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Nacimiento</p>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedClient.date_of_birth).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-md">
                        <p className="text-sm font-medium text-gray-500 mb-1">Dirección</p>
                        <p className="text-sm text-gray-900 truncate">{selectedClient.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Actions Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
                <p className="text-sm text-gray-500">Operaciones frecuentes</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/clients/new"
                  className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="rounded-md bg-emerald-50 p-2">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Nuevo Cliente</h3>
                    <p className="text-xs text-gray-500">Agregar un nuevo cliente al sistema</p>
                  </div>
                </Link>

                <Link
                  to="/clients/birthdays"
                  className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="rounded-md bg-emerald-50 p-2">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Cumpleaños</h3>
                    <p className="text-xs text-gray-500">Gestionar cumpleaños de clientes</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ClientsPage 