"use client"

import * as React from "react"
import { DayPicker, type DayProps } from "react-day-picker"
import { type Locale } from "date-fns"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, "components" | "mode" | "required"> & {
  birthdays?: {
    date: Date;
    names: string[];
  }[];
  showBirthdays?: boolean;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  birthdays = [],
  showBirthdays = false,
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
  const defaultMonth = today

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      defaultMonth={defaultMonth}
      disableNavigation
      formatters={{
        formatCaption: (date: Date, options?: { locale?: Locale }) => {
          return format(date, "MMMM yyyy", { locale: options?.locale })
        },
      }}
     
     
      components={{
        Day: ({ day, ...props }: DayProps): React.ReactElement => {
          const date = day.date
          const birthdayNames = getBirthdayNames(date)
          const hasBirthday = birthdayNames.length > 0

          return (
            <td
              role="gridcell"
              className={cn(
                "relative p-0 text-center h-9 md:h-10",
                "focus-within:relative focus-within:z-20"
              )}
            >
              <div
                {...props}
                className={cn(
                  "mx-auto flex h-9 md:h-10 w-full items-center justify-center",
                  "text-sm font-normal transition-all duration-200 relative",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  "rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900",
                  hasBirthday && "font-medium"
                )}
              >
                <div >
                  <time dateTime={format(date, "yyyy-MM-dd")} className="relative z-10">
                    {date.getDate()}
                  </time>
                  {format(date, "d MMM") === "1 Jan" && (
                    <span className="absolute -top-1.5 right-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                      Jan
                    </span>
                  )}
                  {format(date, "d MMM") === "1 Feb" && (
                    <span className="absolute -top-1.5 right-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                      Feb
                    </span>
                  )}
                </div>
                {hasBirthday && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-0.5">
                      {birthdayNames.map((_, index) => (
                        <div
                          key={index}
                          className="h-1 w-1 rounded-full bg-green-500/50 dark:bg-green-400/50"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </td>
          )
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 