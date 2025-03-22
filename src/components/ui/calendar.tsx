"use client"

import * as React from "react"
import { DayPicker, type DayProps } from "react-day-picker"
import { type Locale } from "date-fns"
import { format, addMonths, subMonths, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

// Custom tooltip component for birthdays
const BirthdayTooltip = ({ 
  names, 
  isVisible
}: { 
  names: string[];
  isVisible: boolean;
}) => {
  return (
    <div className={cn(
      "absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-200",
      "opacity-0 translate-y-2 pointer-events-none",
      isVisible && "opacity-100 translate-y-0"
    )}>
      <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-gray-200 text-xs text-left w-max max-w-[220px]">
        <div className="font-medium text-emerald-600 mb-1">🎂 Cumpleaños:</div>
        <ul className="space-y-1">
          {names.map((name, i) => (
            <li key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">{name}</li>
          ))}
        </ul>
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-200"></div>
    </div>
  );
};

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, "components" | "mode" | "required"> & {
  birthdays?: {
    date: Date;
    names: string[];
  }[];
  showBirthdays?: boolean;
  onMonthChange?: (date: Date) => void;
  disableNavigation?: boolean;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  birthdays = [],
  showBirthdays = false,
  month,
  onMonthChange,
  disableNavigation = false,
  ...props
}: CalendarProps) {
  // Function to get birthday names for a date
  const getBirthdayNames = (date: Date) => {
    if (!showBirthdays) return []
    return birthdays
      .filter(
        birthday =>
          birthday.date.getDate() === date.getDate() &&
          birthday.date.getMonth() === date.getMonth()
      )
      .flatMap(birthday => birthday.names)
  }

  const today = new Date()
  const defaultMonth = month || today

  const handlePreviousMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (onMonthChange && month) {
      onMonthChange(subMonths(month, 1))
    }
  }

  const handleNextMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (onMonthChange && month) {
      onMonthChange(addMonths(month, 1))
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {!disableNavigation && onMonthChange && (
        <div className="flex items-center justify-between px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-9 w-9 p-0 rounded-full border-emerald-100 hover:bg-emerald-50"
          >
            <ChevronLeft className="h-5 w-5 text-emerald-600" />
            <span className="sr-only">Previous month</span>
          </Button>
          <h2 className="text-sm font-medium text-gray-800">
            {month ? format(month, 'MMMM yyyy') : 'Calendar'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-9 w-9 p-0 rounded-full border-emerald-100 hover:bg-emerald-50"
          >
            <ChevronRight className="h-5 w-5 text-emerald-600" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      )}

      <DayPicker
        showOutsideDays={showOutsideDays}
        defaultMonth={defaultMonth}
        month={month}
        onMonthChange={onMonthChange}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-6",
          caption: "flex justify-center pt-2 pb-1 relative items-center",
          caption_label: "text-base font-medium text-emerald-900",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-2",
          head_row: "flex justify-between",
          head_cell:
            "text-emerald-600 font-medium rounded-md px-1 py-2 w-10 text-[0.8rem] uppercase",
          row: "flex w-full mt-3 gap-2",
          cell: "relative h-11 w-11 text-center p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-11 w-11 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 hover:text-emerald-900 focus:bg-emerald-100 focus:text-emerald-900",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        disableNavigation={disableNavigation}
        formatters={{
          formatCaption: (date: Date, options?: { locale?: Locale }) => {
            return disableNavigation ? "" : format(date, "MMMM yyyy", { locale: options?.locale })
          },
        }}
        components={{
          Day: ({ day, ...dayProps }: DayProps): React.ReactElement => {
            const date = day.date
            const birthdayNames = getBirthdayNames(date)
            const hasBirthday = birthdayNames.length > 0
            const isToday = isSameDay(date, new Date())
            const isSelected = dayProps.modifiers?.selected
            
            // State for tooltip visibility
            const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
            
            return (
              <td
                role="gridcell"
                className={cn(
                  "relative p-0 text-center",
                  "focus-within:relative focus-within:z-20"
                )}
                onMouseEnter={() => hasBirthday && setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
              >
                <div
                  {...dayProps}
                  className={cn(
                    "mx-auto flex h-11 w-11 items-center justify-center",
                    "text-sm font-normal transition-all duration-200 relative",
                    "hover:bg-emerald-50 dark:hover:bg-emerald-800/50",
                    "rounded-full",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900",
                    hasBirthday && "font-medium",
                    isToday && "border-2 border-emerald-400 font-bold text-emerald-700",
                    isSelected && "bg-emerald-100 text-emerald-900"
                  )}
                >
                  <time dateTime={format(date, "yyyy-MM-dd")} className="relative z-10">
                    {date.getDate()}
                  </time>
                  
                  {format(date, "d MMM") === "1 Jan" && (
                    <span className="absolute -top-1.5 right-0 text-[10px] font-medium bg-emerald-100 px-1 rounded text-emerald-600">
                      Jan
                    </span>
                  )}
                  
                  {format(date, "d MMM") === "1 Feb" && (
                    <span className="absolute -top-1.5 right-0 text-[10px] font-medium bg-emerald-100 px-1 rounded text-emerald-600">
                      Feb
                    </span>
                  )}
                  
                  {hasBirthday && (
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-0.5">
                        {birthdayNames.slice(0, 3).map((_, index) => (
                          <div
                            key={index}
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                          />
                        ))}
                        {birthdayNames.length > 3 && (
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        )}
                      </div>
                    </div>
                  )}
                
                  {hasBirthday && (
                    <BirthdayTooltip names={birthdayNames} isVisible={isTooltipVisible} />
                  )}
                </div>
              </td>
            )
          }
        }}
        {...props}
      />
      
      {showBirthdays && birthdays.length > 0 && (
        <div className="flex items-center justify-center pt-2 text-xs text-gray-500">
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
          <span>Indica cumpleaños en esta fecha</span>
        </div>
      )}
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar } 