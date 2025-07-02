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
  minDate?: Date | string; // Now accepts both Date and string
  maxDate?: Date | string; // Now accepts both Date and string
  disableFuture?: boolean;
  disablePast?: boolean;
  initialDate?: Date | string; // Now accepts both Date and string

  selected: Date | string | undefined; // Now accepts both Date and string
  onChange: (date: string | undefined) => void;
}

export function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-GB");
}

function isValidDate(date: Date | undefined) {
  return date instanceof Date && !isNaN(date.getTime());
}

// New function to parse DD/MM/YYYY string to Date object
function parseDMYtoJSDate(dateString: string | undefined): Date | undefined {
  if (!dateString) return undefined;
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const parsed = new Date(year, month - 1, day);
      parsed.setHours(0, 0, 0, 0);
      return isValidDate(parsed) ? parsed : undefined;
    }
  }
  return undefined;
}

// Helper function to normalize input to Date object
function normalizeToDate(input: Date | string | undefined): Date | undefined {
  if (!input) return undefined;
  if (input instanceof Date) return input;
  if (typeof input === 'string') return parseDMYtoJSDate(input);
  return undefined;
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

  // Convert string props to Date objects for internal use
  const selectedDate = useMemo(() => normalizeToDate(selected), [selected]);
  const initialDateObj = useMemo(() => normalizeToDate(initialDate), [initialDate]);
  const minDateObj = useMemo(() => normalizeToDate(minDate), [minDate]);
  const maxDateObj = useMemo(() => normalizeToDate(maxDate), [maxDate]);

  // internal state for the input field display
  const [inputValue, setInputValue] = useState(
    formatDate(selectedDate || initialDateObj || today)
  ); // Initialize with 'selectedDate' or 'initialDateObj'
  const [open, setOpen] = useState(false);
  // Month for the calendar view, defaults to selectedDate or today
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    selectedDate || initialDateObj || today // Initialize calendar month based on selected, initial, or today
  );

  // Effect to sync the 'selected' prop (from parent) with the internal input display
  useEffect(() => {
    // Only update if the selected prop from the parent changes AND it's different from the current input value
    if (!areDatesEqual(selectedDate, parseDateString(inputValue))) {
      setInputValue(formatDate(selectedDate));
    }
    // Also update calendarMonth if selected changes, to keep the calendar view in sync
    if (selectedDate && !areDatesEqual(selectedDate, calendarMonth)) {
      setCalendarMonth(selectedDate);
    } else if (
      !selectedDate &&
      !areDatesEqual(today, calendarMonth) &&
      !initialDateObj
    ) {
      // If cleared and no initialDate, go back to today's month
      setCalendarMonth(today);
    }
  }, [selectedDate, today, initialDateObj]); // Updated dependencies

  // Helper to parse DD/MM/YYYY string to Date object (existing function)
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
        (!minDateObj || (parsedDate && parsedDate >= minDateObj)) &&
        (!maxDateObj || (parsedDate && parsedDate <= maxDateObj)) &&
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
        value={formatDate(selectedDate)} // Always format for the hidden input, use 'selectedDate'
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
              selected={selectedDate} // Bind calendar to the normalized 'selectedDate'
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
                if (minDateObj && normalizedDateToCheck < minDateObj) return true;
                if (maxDateObj && normalizedDateToCheck > maxDateObj) return true;
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