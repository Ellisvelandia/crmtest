'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '../../../../../components/ui/card'
import { CalendarViewProps } from '../types'
import { animations } from '../animations'

export const CalendarView = ({}: CalendarViewProps) => (
  <motion.div
    variants={animations.calendarVariants}
    className="perspective-[1200px] origin-center will-change-transform w-full"
  >
    <Card className="bg-white overflow-hidden hover:shadow-md transition-shadow duration-300 w-full">
      <CardContent className="p-4 md:p-6">
        {/* Calendar content goes here */}
      </CardContent>
    </Card>
  </motion.div>
)

export default CalendarView; 