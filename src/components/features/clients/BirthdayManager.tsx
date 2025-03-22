'use client'

import { useState, useMemo } from 'react'
import { Client } from '../../../types'
import { format, addMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Calendar } from '../../../components/ui/calendar'
import { Button } from '../../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

interface BirthdayManagerProps {
  clients: Client[]
}

export const BirthdayManager = ({ clients }: BirthdayManagerProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter and sort clients based on their birthdays
  const filteredClients = useMemo(() => {
    const startDate = startOfMonth(addMonths(new Date(2000, selectedMonth, 1), 0))
    const endDate = endOfMonth(startDate)

    return clients
      .filter(client => {
        const birthDate = new Date(client.date_of_birth)
        const compareDate = new Date(2000, birthDate.getMonth(), birthDate.getDate())
        return isWithinInterval(compareDate, { start: startDate, end: endDate })
      })
      .sort((a, b) => {
        const dateA = new Date(a.date_of_birth)
        const dateB = new Date(b.date_of_birth)
        const dayA = dateA.getDate()
        const dayB = dateB.getDate()
        return sortOrder === 'asc' ? dayA - dayB : dayB - dayA
      })
  }, [clients, selectedMonth, sortOrder])

  // Generate birthday report in CSV format
  const generateReport = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Apellido', 'Fecha de Nacimiento', 'Email', 'Teléfono'].join(','),
      ...filteredClients.map(client => [
        client.customer_id,
        client.first_name,
        client.last_name,
        format(new Date(client.date_of_birth), 'dd/MM/yyyy'),
        client.email,
        client.phone
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reporte-cumpleanos-${format(new Date(2000, selectedMonth), 'MMMM-yyyy', { locale: es })}.csv`
    link.click()
  }

  // Generate calendar export in iCal format
  const exportCalendar = () => {
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CursorCRM//Birthday Calendar//ES',
      ...filteredClients.map(client => {
        const birthDate = new Date(client.date_of_birth)
        const currentYear = new Date().getFullYear()
        return [
          'BEGIN:VEVENT',
          `UID:${client.customer_id}-${currentYear}@cursorcrm`,
          `DTSTART:${currentYear}${String(birthDate.getMonth() + 1).padStart(2, '0')}${String(birthDate.getDate()).padStart(2, '0')}`,
          'DURATION:P1D',
          'RRULE:FREQ=YEARLY',
          `SUMMARY:🎂 Cumpleaños de ${client.first_name} ${client.last_name}`,
          'END:VEVENT'
        ].join('\n')
      }),
      'END:VCALENDAR'
    ].join('\n')

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'cumpleanos-clientes.ics'
    link.click()
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <CardTitle className="text-xl sm:text-2xl">Gestión de Cumpleaños</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateReport}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Exportar</span> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCalendar}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Exportar</span> Calendario
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2000, i, 1), 'MMMM', { locale: es })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedView}
              onValueChange={(value: 'list' | 'calendar') => setSelectedView(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">Lista</SelectItem>
                <SelectItem value="calendar">Calendario</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascendente</SelectItem>
                <SelectItem value="desc">Descendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedView === 'list' ? (
              <div className="grid gap-4">
                {filteredClients.map(client => (
                  <motion.div
                    key={client.customer_id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          {client.first_name} {client.last_name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                            {format(new Date(client.date_of_birth), 'dd MMMM', { locale: es })}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {client.customer_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="hidden sm:inline">{client.email}</span>
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredClients.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                  >
                    <p>No hay cumpleaños en este mes</p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="w-full">
                <Calendar
                  month={new Date(2000, selectedMonth)}
                  className="w-full"
                  showBirthdays={true}
                  birthdays={filteredClients.map(client => ({
                    date: new Date(client.date_of_birth),
                    names: [`${client.first_name} ${client.last_name}`]
                  }))}
                />
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
} 