'use client'

import { useState, useEffect } from 'react'
import { Client } from '../../types'
import { BirthdayManager } from '../../components/features/clients/BirthdayManager'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase/config'
import { Loader2, Calendar, Gift, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { addMonths, format } from 'date-fns'
import { es } from 'date-fns/locale'

const BirthdaysPage = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth())

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

  // Update selected month index when current month changes
  useEffect(() => {
    setSelectedMonthIndex(currentMonth.getMonth())
  }, [currentMonth])

  // Get current month birthdays
  const currentMonthBirthdays = clients.filter(
    client => new Date(client.date_of_birth).getMonth() === currentMonth.getMonth()
  )

  // Get upcoming birthdays (next month)
  const nextMonthIndex = (currentMonth.getMonth() + 1) % 12
  const nextMonthBirthdays = clients.filter(
    client => new Date(client.date_of_birth).getMonth() === nextMonthIndex
  )

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  // Handle month change from BirthdayManager
  const handleBirthdayManagerMonthChange = (monthIndex: number) => {
    setSelectedMonthIndex(monthIndex)
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1))
  }

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

                {/* Month Navigation and Stats Cards */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-emerald-100 shadow-sm">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={goToPreviousMonth}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4 text-emerald-600" />
                    </Button>
                    <h3 className="text-sm font-medium text-emerald-800">
                      {format(currentMonth, 'MMMM yyyy', { locale: es })}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={goToNextMonth}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Button>
                  </div>
                
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
                </div>
              </motion.div>
            </div>

            {/* Birthday Manager Section */}
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
                    <BirthdayManager 
                      clients={clients} 
                      initialMonth={selectedMonthIndex}
                      onMonthChange={handleBirthdayManagerMonthChange}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BirthdaysPage 