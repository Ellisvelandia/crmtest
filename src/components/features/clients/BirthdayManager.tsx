'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { BirthdayManagerProps } from './birthday-manager/types'
import { animations } from './birthday-manager/animations'
import { Controls } from './birthday-manager/components/Controls'
import { ListView } from './birthday-manager/components/ListView'
import { CalendarView } from './birthday-manager/components/CalendarView'

export const BirthdayManager = ({ 
  clients,
  initialMonth,
  onMonthChange
}: BirthdayManagerProps) => {
  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filter and sort clients based on their birthdays
  const filteredClients = useMemo(() => {
    return clients
      .sort((a, b) => {
        const dateA = new Date(a.date_of_birth)
        const dateB = new Date(b.date_of_birth)
        const dayA = dateA.getDate()
        const dayB = dateB.getDate()
        return sortOrder === 'asc' ? dayA - dayB : dayB - dayA
      })
  }, [clients, sortOrder])

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

    downloadFile(
      csvContent, 
      'reporte-cumpleanos.csv', 
      'text/csv;charset=utf-8;'
    )
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

    downloadFile(icalContent, 'cumpleanos-clientes.ics', 'text/calendar;charset=utf-8;')
  }

  // Helper function to download a file
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  // Handle view change with transition
  const handleViewChange = (view: 'list' | 'calendar') => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedView(view)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="space-y-6">
      <Controls 
        selectedView={selectedView}
        sortOrder={sortOrder}
        isTransitioning={isTransitioning}
        onViewChange={handleViewChange}
        onSortOrderChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        onExportCSV={generateReport}
        onExportCalendar={exportCalendar}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedView}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animations.containerVariants}
          className="min-h-[400px] perspective-[1200px]"
          transition={animations.pageTransition}
        >
          {selectedView === 'list' ? (
            <ListView clients={filteredClients} />
          ) : (
            <CalendarView 
              initialMonth={initialMonth}
              onMonthChange={onMonthChange}
              clients={filteredClients}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 