// app/utils/commonDatepicker.tsx
"use client";

import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

interface DatePickerProps {
  className?: string;
  placeholder?: string;
  name: string; // Make name required
  required?: boolean;
  "data-validate"?: string;
  id: string;
  minDate?: Date;
  maxDate?: Date;
  disableFuture?: boolean;
  disablePast?: boolean;
  initialDate?: Date;

  selected: Date | undefined;
  onChange: (date: string | undefined) => void;
}

export function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-GB");
}

function isValidDate(date: Date | undefined) {
  return date instanceof Date && !isNaN(date.getTime());
}



  
const DatePicker = ({
  className,
  placeholder = "Select date",
  name,
  required = false,
  "data-validate": dataValidate,
  id,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  initialDate,
  selected,
  onChange,
}: DatePickerProps) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    return d;
  }, []);

  // internal state for the input field display
  const [inputValue, setInputValue] = useState(
    formatDate(selected || initialDate || today)
  ); // Initialize with 'selected' or 'initialDate'
  const [open, setOpen] = useState(false);
  // Month for the calendar view, defaults to selectedDate or today
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    selected || initialDate || today // Initialize calendar month based on selected, initial, or today
  );

  // Effect to sync the 'selected' prop (from parent) with the internal input display
  useEffect(() => {
    // Only update if the selected prop from the parent changes AND it's different from the current input value
    if (!areDatesEqual(selected, parseDateString(inputValue))) {
      setInputValue(formatDate(selected));
    }
    // Also update calendarMonth if selected changes, to keep the calendar view in sync
    if (selected && !areDatesEqual(selected, calendarMonth)) {
      setCalendarMonth(selected);
    } else if (
      !selected &&
      !areDatesEqual(today, calendarMonth) &&
      !initialDate
    ) {
      // If cleared and no initialDate, go back to today's month
      setCalendarMonth(today);
    }
  }, [selected, inputValue, calendarMonth, today, initialDate]); // Add initialDate as dependency

  // Helper to parse DD/MM/YYYY string to Date object
  const parseDateString = (dateString: string): Date | undefined => {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts;
      const day = parseInt(dayStr, 10);
      const monthNum = parseInt(monthStr, 10); // month-1 for Date constructor
      const year = parseInt(yearStr, 10);
      if (!isNaN(day) && !isNaN(monthNum) && !isNaN(year)) {
        const parsed = new Date(year, monthNum - 1, day);
        parsed.setHours(0, 0, 0, 0);
        return isValidDate(parsed) ? parsed : undefined;
      }
    }
    return undefined;
  };

  // Helper to compare dates without time for useEffect dependency
  const areDatesEqual = (date1: Date | undefined, date2: Date | undefined) => {
    if (!date1 && !date2) return true;
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parsedDate = parseDateString(value);

    if (isValidDate(parsedDate)) {
      const isDateAllowed =
        (!minDate || (parsedDate && parsedDate >= minDate)) &&
        (!maxDate || (parsedDate && parsedDate <= maxDate)) &&
        (!disableFuture || (parsedDate && parsedDate <= today)) &&
        (!disablePast || (parsedDate && parsedDate >= today));

      if (isDateAllowed) {
        onChange(formatDate(parsedDate)); // Call parent's onChange with valid date
        setCalendarMonth(parsedDate as Date); // Update calendar month on valid manual input
      } else {
        onChange(undefined); // Call parent's onChange with undefined if out of range
      }
    } else {
      onChange(undefined); // Call parent's onChange with undefined if invalid
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      date.setHours(0, 0, 0, 0); // Normalize selected date
    }
    onChange(formatDate(date)); // Call the parent's onChange function
    setInputValue(formatDate(date)); // Update the internal input field display
    if (date) {
      setCalendarMonth(date); // Keep calendar on the selected month
    } else {
      setCalendarMonth(today); // If cleared, go back to today's month
    }
    setOpen(false); // Close the popover
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={formatDate(selected)} // Always format for the hidden input, use 'selected' prop
        required={required}
        data-validate={dataValidate}
      />

      <div className="relative flex gap-2">
        <Input
          id={id}
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button" // Important: Prevent form submission
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selected} // Bind calendar to the 'selected' prop from the parent
              captionLayout="dropdown"
              month={calendarMonth} // Control calendar's displayed month
              onMonthChange={setCalendarMonth}
              onSelect={handleCalendarSelect} // This is where the selected date is handled
              defaultMonth={calendarMonth} // Default calendar to its controlled month
              disabled={(dateToCheck) => {
                const normalizedDateToCheck = new Date(
                  dateToCheck.getFullYear(),
                  dateToCheck.getMonth(),
                  dateToCheck.getDate()
                );
                const normalizedToday = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );

                if (disableFuture && normalizedDateToCheck > normalizedToday)
                  return true;
                if (disablePast && normalizedDateToCheck < normalizedToday)
                  return true;
                if (minDate && normalizedDateToCheck < minDate) return true;
                if (maxDate && normalizedDateToCheck > maxDate) return true;
                return false;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;
