import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  dateFrom?: Date
  dateTo?: Date
  onDateFromChange?: (date: Date | undefined) => void
  onDateToChange?: (date: Date | undefined) => void
  placeholderFrom?: string
  placeholderTo?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  placeholderFrom = "From date",
  placeholderTo = "To date",
  disabled = false,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <DatePicker
        date={dateFrom}
        onDateChange={onDateFromChange}
        placeholder={placeholderFrom}
        disabled={disabled}
        className="flex-1"
      />
      <DatePicker
        date={dateTo}
        onDateChange={onDateToChange}
        placeholder={placeholderTo}
        disabled={disabled}
        className="flex-1"
      />
    </div>
  )
}