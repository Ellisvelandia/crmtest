'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import { Card, CardContent } from '../../../../../components/ui/card'
import { Badge } from '../../../../../components/ui/badge'
import { ClientListItemProps } from '../types'
import { animations } from '../animations'

export const ClientListItem = ({ client, index }: ClientListItemProps) => (
  <motion.div
    key={client.customer_id}
    variants={animations.fadeInUp}
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
)

export default ClientListItem; 