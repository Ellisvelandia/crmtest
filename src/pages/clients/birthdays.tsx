'use client'

import { useState, useEffect } from 'react'
import { Client } from '../../types'
import { BirthdayManager } from '../../components/features/clients/BirthdayManager'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase/config'
import { Loader2, Calendar, Gift, Download, Bell } from 'lucide-react'
import { Button } from '../../components/ui/button'

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
        {/* Enhanced gradient background */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-50/70 via-emerald-50/30 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Enhanced Header Section */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Gestión de Cumpleaños
                  </h1>
                  <p className="text-base text-gray-600">
                    Administrar y monitorear cumpleaños de clientes
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-100 shadow-sm"
                  >
                    <div className="rounded-full bg-emerald-50 p-2">
                      <Gift className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Este Mes</p>
                      <p className="text-2xl font-semibold text-emerald-600">
                        {currentMonthBirthdays.length}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-100 shadow-sm"
                  >
                    <div className="rounded-full bg-emerald-50 p-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Próximo Mes</p>
                      <p className="text-2xl font-semibold text-emerald-600">
                        {nextMonthBirthdays.length}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Birthday Manager Section with enhanced loading state */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-16 gap-4"
                >
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                  <p className="text-sm text-gray-600">Cargando datos de clientes...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 w-full">
                      <BirthdayManager clients={clients} />
                    </div>
                  </div>

                  {/* Enhanced Quick Actions Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
                        <p className="text-sm text-gray-600">Operaciones frecuentes para gestión de cumpleaños</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="self-start sm:self-center"
                        onClick={() => {}}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Todo
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200"
                      >
                        <div className="rounded-lg bg-emerald-50 p-3 group-hover:bg-emerald-100 transition-colors">
                          <Bell className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-900">Recordatorios</h3>
                          <p className="text-sm text-gray-600">Configura notificaciones automáticas para cumpleaños próximos</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 -ml-2"
                          >
                            Configurar
                          </Button>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200"
                      >
                        <div className="rounded-lg bg-emerald-50 p-3 group-hover:bg-emerald-100 transition-colors">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-900">Calendario</h3>
                          <p className="text-sm text-gray-600">Visualiza y gestiona todos los cumpleaños en formato calendario</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 -ml-2"
                          >
                            Ver Calendario
                          </Button>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200"
                      >
                        <div className="rounded-lg bg-emerald-50 p-3 group-hover:bg-emerald-100 transition-colors">
                          <Gift className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-900">Celebraciones</h3>
                          <p className="text-sm text-gray-600">Planifica y gestiona eventos especiales para cumpleaños</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 -ml-2"
                          >
                            Planificar
                          </Button>
                        </div>
                      </motion.div>
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