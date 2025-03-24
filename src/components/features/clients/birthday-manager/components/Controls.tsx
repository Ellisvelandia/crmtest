'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '../../../../../components/ui/button'
import { Calendar as CalendarIcon, List, ArrowUpDown, Download, ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select'
import { Tooltip } from '../../../../../components/ui/tooltip'
import { ControlsProps } from '../types'

export const Controls = ({
  selectedMonth,
  selectedView,
  sortOrder,
  isTransitioning,
  onMonthSelect,
  onViewChange,
  onSortOrderChange,
  onExportCSV,
  onExportCalendar
}: ControlsProps) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div className="flex flex-wrap gap-4 items-center">
      <Select
        value={selectedMonth.toString()}
        onValueChange={onMonthSelect}
      >
        <SelectTrigger className="w-[180px] bg-white border-emerald-100 hover:border-emerald-200 transition-colors" aria-label="Seleccionar mes">
          <CalendarIcon className="h-4 w-4 mr-2 text-emerald-600" />
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
          onClick={() => !isTransitioning && onViewChange('list')}
          aria-label="Vista de lista"
          className={`transition-all duration-300 ${selectedView === 'list' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:text-emerald-700'}`}
        >
          <List className="h-4 w-4 mr-2" />
          Lista
        </Button>
        <Button
          variant={selectedView === 'calendar' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => !isTransitioning && onViewChange('calendar')}
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
        onClick={onSortOrderChange}
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
          onClick={onExportCSV}
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
          onClick={onExportCalendar}
          aria-label="Exportar a Calendario"
          className="bg-white border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
        >
          <CalendarIcon className="h-4 w-4 mr-2 text-emerald-600" />
          iCal
        </Button>
      </Tooltip>
    </div>
  </div>
)

export default Controls; 