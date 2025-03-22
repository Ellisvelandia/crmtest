'use client'

import { useState, useEffect } from 'react'
import { Client } from '../../types'
import { BirthdayManager } from '../../components/features/clients/BirthdayManager'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase/config'
import { Loader2 } from 'lucide-react'

const BirthdaysPage = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Get current month birthdays
  const currentMonthBirthdays = clients.filter(
    client => new Date(client.date_of_birth).getMonth() === new Date().getMonth()
  )

  // Get upcoming birthdays (next month)
  const nextMonthBirthdays = clients.filter(
    client => new Date(client.date_of_birth).getMonth() === (new Date().getMonth() + 1) % 12
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="relative">
        {/* Subtle top gradient - matching index.tsx */}
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
                <h1 className="text-2xl font-semibold text-gray-900">Gestión de Cumpleaños</h1>
                <p className="text-sm text-gray-500 mt-1">Administrar y monitorear cumpleaños de clientes</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  Este mes: {currentMonthBirthdays.length}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50/50 text-emerald-600">
                  Próximo mes: {nextMonthBirthdays.length}
                </span>
              </div>
            </div>

            {/* Birthday Manager Section */}
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center py-12"
                >
                  <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 w-full">
                      <BirthdayManager clients={clients} />
                    </div>
                  </div>

                  {/* Quick Actions Section - matching index.tsx style */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-6"
                  >
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
                      <p className="text-sm text-gray-500">Operaciones frecuentes</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                        <div className="rounded-md bg-emerald-50 p-2">
                          <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Recordatorios</h3>
                          <p className="text-xs text-gray-500">Configurar notificaciones de cumpleaños</p>
                        </div>
                      </div>

                      <div className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                        <div className="rounded-md bg-emerald-50 p-2">
                          <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Exportar Lista</h3>
                          <p className="text-xs text-gray-500">Descargar lista de cumpleaños</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BirthdaysPage 