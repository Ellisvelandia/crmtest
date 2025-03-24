'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../../../../../components/ui/card'
import { animations } from '../animations'
import { CalendarViewProps } from '../types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../components/ui/tooltip'

export const CalendarView = ({ initialMonth, onMonthChange, clients }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), initialMonth))

  // Update parent when month changes
  useEffect(() => {
    onMonthChange(currentDate.getMonth())
  }, [currentDate, onMonthChange])

  // Get days for current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day names
  const weekDays = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']

  // Calculate starting position for first day (0-6)
  const firstDayOffset = monthStart.getDay()

  // Get birthdays for a specific day
  const getBirthdays = (day: Date) => {
    return clients.filter(client => {
      const birthDate = new Date(client.date_of_birth)
      return birthDate.getDate() === day.getDate() && 
             birthDate.getMonth() === day.getMonth()
    })
  }

  return (
    <motion.div
      variants={animations.calendarVariants}
      className="perspective-[1200px] origin-center will-change-transform w-full"
    >
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-gray-500 text-center p-3 border-b border-gray-200 bg-gray-50"
              >
                {day}
              </div>
            ))}

            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOffset }).map((_, index) => (
              <div 
                key={`empty-${index}`} 
                className="p-3 border-b border-r border-gray-200 last:border-r-0" 
              />
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const birthdays = getBirthdays(day)
              const hasBirthdays = birthdays.length > 0
              const isToday = day.getDate() === new Date().getDate() && isSameMonth(day, new Date())
              
              return (
                <div
                  key={day.toString()}
                  className={`
                    relative p-3 border-b border-r border-gray-200 last:border-r-0
                    ${(index + firstDayOffset + 1) % 7 === 0 ? 'border-r-0' : ''}
                    ${Math.floor((index + firstDayOffset) / 7) === Math.floor((days.length + firstDayOffset - 1) / 7) ? 'border-b-0' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`
                        relative group cursor-pointer
                        ${hasBirthdays ? 'animate-pulse-subtle' : ''}
                      `}>
                        <div className={`
                          relative z-10 w-full aspect-square flex items-center justify-center
                          ${hasBirthdays ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-sm' : ''}
                          ${isToday ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
                          transition-all duration-200 ease-in-out
                          group-hover:scale-110 group-hover:shadow-md
                        `}>
                          <span className={`
                            text-sm font-medium
                            ${hasBirthdays ? 'text-emerald-700' : 'text-gray-700'}
                            ${isToday ? 'text-emerald-600 font-semibold' : ''}
                          `}>
                            {format(day, 'd')}
                          </span>
                          
                          {hasBirthdays && (
                            <div className="absolute top-0 right-0 -mr-1 -mt-1">
                              <div className="relative">
                                <div className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-400 opacity-20 w-3 h-3" />
                                <div className="relative rounded-full bg-emerald-500 w-3 h-3 flex items-center justify-center">
                                  <span className="text-[8px] text-white font-bold">
                                    {birthdays.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {hasBirthdays && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                            {birthdays.slice(0, 3).map((_, i) => (
                              <span 
                                key={i} 
                                className="w-1 h-1 rounded-full bg-emerald-500 opacity-75"
                              />
                            ))}
                            {birthdays.length > 3 && (
                              <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-50" />
                            )}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {hasBirthdays && (
                      <TooltipContent>
                        <div className="text-sm space-y-2 min-w-[200px]">
                          <p className="font-medium text-emerald-700 border-b border-emerald-100 pb-1">
                            🎂 Cumpleaños del día
                          </p>
                          <div className="space-y-1.5">
                            {birthdays.map(client => (
                              <div key={client.customer_id} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <p className="text-sm text-gray-700">
                                  {client.first_name} {client.last_name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CalendarView 