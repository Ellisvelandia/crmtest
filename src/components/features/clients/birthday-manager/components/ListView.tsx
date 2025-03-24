'use client'

import { ListViewProps } from '../types'
import { ClientListItem } from './ClientListItem'
import { EmptyState } from './EmptyState'

export const ListView = ({ clients }: ListViewProps) => (
  <div className="grid gap-4">
    {clients.length > 0 ? (
      clients.map((client, index) => (
        <ClientListItem key={client.customer_id} client={client} index={index} />
      ))
    ) : (
      <EmptyState />
    )}
  </div>
)

export default ListView; 