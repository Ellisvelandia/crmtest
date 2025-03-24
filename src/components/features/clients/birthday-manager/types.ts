import { Client } from '../../../../types'

export interface BirthdayManagerProps {
  clients: Client[]
  initialMonth: number
  onMonthChange: (monthIndex: number) => void
}

export interface ControlsProps {
  selectedView: 'list' | 'calendar'
  sortOrder: 'asc' | 'desc'
  isTransitioning: boolean
  onViewChange: (view: 'list' | 'calendar') => void
  onSortOrderChange: () => void
  onExportCSV: () => void
  onExportCalendar: () => void
}

export interface ClientListItemProps {
  client: Client
  index: number
}

export interface ListViewProps {
  clients: Client[]
}

export interface CalendarViewProps {
  initialMonth: number
  onMonthChange: (monthIndex: number) => void
  clients: Client[]
}

export type ViewType = 'list' | 'calendar'
export type SortOrderType = 'asc' | 'desc' 