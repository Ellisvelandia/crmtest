import { Client } from '../../../../types'

export interface BirthdayManagerProps {
  clients: Client[]
  initialMonth?: number
  onMonthChange?: (monthIndex: number) => void
}

export interface ControlsProps {
  selectedMonth: number
  selectedView: 'list' | 'calendar'
  sortOrder: 'asc' | 'desc'
  isTransitioning: boolean
  onMonthSelect: (value: string) => void
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
  // Add calendar view props if needed
} 