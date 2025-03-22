'use client'

import { useState, useMemo, useEffect } from 'react'
import { Client } from '../../../types'
import { format, addMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '../../../components/ui/calendar'
import { Button } from '../../../components/ui/button'
import { Calendar as CalendarIcon, List, ArrowUpDown, Download, Gift, ChevronDown } from 'lucide-react'
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
  initialMonth?: number
  onMonthChange?: (monthIndex: number) => void
}

export const BirthdayManager = ({ 
  clients, 
  initialMonth,
  onMonthChange 
}: BirthdayManagerProps) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth ?? new Date().getMonth())
  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2000, selectedMonth, 1))
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Update state when initialMonth prop changes
  useEffect(() => {
    if (initialMonth !== undefined) {
      setSelectedMonth(initialMonth)
      setCalendarDate(new Date(calendarDate.getFullYear(), initialMonth, 1))
    }
  }, [initialMonth, calendarDate.getFullYear()])

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

  // Handle calendar month change
  const handleCalendarMonthChange = (date: Date) => {
    setCalendarDate(date)
    const newMonthIndex = date.getMonth()
    setSelectedMonth(newMonthIndex)
    
    // Notify parent component if callback provided
    if (onMonthChange) {
      onMonthChange(newMonthIndex)
    }
  }

  // Handle month selection from dropdown
  const handleMonthSelect = (value: string) => {
    const monthIndex = parseInt(value)
    setSelectedMonth(monthIndex)
    setCalendarDate(new Date(calendarDate.getFullYear(), monthIndex, 1))
    
    // Notify parent component if callback provided
    if (onMonthChange) {
      onMonthChange(monthIndex)
    }
  }

  // Handle view change with transition
  const handleViewChange = (view: 'list' | 'calendar') => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedView(view)
      setIsTransitioning(false)
    }, 300)
  }

  // Animation variants for view transitions
  const containerVariants = {
    list: {
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    },
    calendar: {
      transition: { staggerChildren: 0, delayChildren: 0 }
    }
  }

  const fadeInUp = {
    initial: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(8px)'
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      filter: 'blur(8px)',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  const calendarVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.92,
      rotateX: 5,
      filter: 'blur(8px)'
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 200,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.92,
      rotateX: -5,
      filter: 'blur(8px)',
      transition: {
        duration: 0.3
      }
    }
  }

  // Page transitions
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthSelect}
          >
            <SelectTrigger className="w-[180px] bg-white border-emerald-100 hover:border-emerald-200 transition-colors" aria-label="Seleccionar mes">
              <CalendarIcon className="h-4 w-4 mr-2 text-emerald-500" />
              <SelectValue placeholder="Seleccionar mes" />
              <ChevronDown className="h-3 w-3 opacity-50 ml-2" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2000, i, 1), 'MMMM', { locale: es })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 bg-white rounded-lg border border-emerald-100 p-0.5">
            <Button
              variant={selectedView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => !isTransitioning && handleViewChange('list')}
              aria-label="Vista de lista"
              className={`transition-all duration-300 ${selectedView === 'list' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:text-emerald-700'}`}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={selectedView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => !isTransitioning && handleViewChange('calendar')}
              aria-label="Vista de calendario"
              className={`transition-all duration-300 ${selectedView === 'calendar' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:text-emerald-700'}`}
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
            className="bg-white border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
          >
            <ArrowUpDown className={`h-4 w-4 mr-2 transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : 'rotate-0'}`} />
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
              className="bg-white border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2 text-emerald-600" />
              CSV
            </Button>
          </Tooltip>
          <Tooltip content="Exportar a Calendario">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCalendar}
              aria-label="Exportar a Calendario"
              className="bg-white border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <CalendarIcon className="h-4 w-4 mr-2 text-emerald-600" />
              iCal
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedView}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={containerVariants}
          className="min-h-[400px] perspective-[1200px]"
          transition={pageTransition}
        >
          {selectedView === 'list' ? (
            <div className="grid gap-4">
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <motion.div
                    key={client.customer_id}
                    variants={fadeInUp}
                    custom={index}
                    className="origin-bottom will-change-transform"
                  >
                    <Card className="group bg-white hover:shadow-md hover:border-emerald-200 transition-all duration-300 overflow-hidden">
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
                ))
              ) : (
                <motion.div
                  variants={fadeInUp}
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
            <motion.div
              variants={calendarVariants}
              className="perspective-[1200px] origin-center will-change-transform"
            >
              <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <Calendar
                    month={calendarDate}
                    onMonthChange={handleCalendarMonthChange}
                    className="w-full"
                    showBirthdays={true}
                    disableNavigation={false}
                    birthdays={filteredClients.map(client => ({
                      date: new Date(client.date_of_birth),
                      names: [`${client.first_name} ${client.last_name}`]
                    }))}
                    locale={es}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 