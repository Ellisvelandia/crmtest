'use client'

import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import { animations } from '../animations'

export const EmptyState = () => (
  <motion.div
    variants={animations.fadeInUp}
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
)

export default EmptyState; 