'use client'

import { useState, useMemo } from 'react'
import { Client } from '../../../types'
import { format, addMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '../../../components/ui/calendar'
import { Button } from '../../../components/ui/button'
import { Calendar as CalendarIcon, List, ArrowUpDown, Download, Gift } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Tooltip } from '../../../components/ui/tooltip'

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
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]" aria-label="Seleccionar mes">
              <CalendarIcon className="h-4 w-4 mr-2 text-emerald-500" />
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

          <div className="flex items-center gap-2">
            <Button
              variant={selectedView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('list')}
              aria-label="Vista de lista"
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={selectedView === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('calendar')}
              aria-label="Vista de calendario"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendario
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            aria-label="Cambiar orden"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Tooltip content="Exportar a CSV">
            <Button
              variant="outline"
              size="sm"
              onClick={generateReport}
              aria-label="Exportar a CSV"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </Tooltip>
          <Tooltip content="Exportar a Calendario">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCalendar}
              aria-label="Exportar a Calendario"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              iCal
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === 'list' ? (
            <div className="grid gap-4">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.customer_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="group hover:border-emerald-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-emerald-50 p-3 group-hover:bg-emerald-100 transition-colors">
                            <Gift className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium text-gray-900">
                              {client.first_name} {client.last_name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                                {format(new Date(client.date_of_birth), 'dd MMMM', { locale: es })}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                ID: {client.customer_id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 ml-auto">
                          <a
                            href={`mailto:${client.email}`}
                            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                          >
                            {client.email}
                          </a>
                          <a
                            href={`tel:${client.phone}`}
                            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                          >
                            {client.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {filteredClients.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="rounded-full bg-emerald-50 p-4 w-16 h-16 mx-auto mb-4">
                    <Gift className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-gray-600">No hay cumpleaños en este mes</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Selecciona otro mes para ver más cumpleaños
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <Calendar
                  month={new Date(2000, selectedMonth)}
                  className="w-full"
                  showBirthdays={true}
                  birthdays={filteredClients.map(client => ({
                    date: new Date(client.date_of_birth),
                    names: [`${client.first_name} ${client.last_name}`]
                  }))}
                />
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 