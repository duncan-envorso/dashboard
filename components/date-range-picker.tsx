'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { type DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface CalendarDateRangePickerProps {
  className?: string;
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  date: externalDate,
  onDateChange
}: CalendarDateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    {
      from: new Date(2023, 0, 20),
      to: addDays(new Date(2023, 0, 20), 20)
    }
  );

  // Use either external or internal state
  const date = externalDate ?? internalDate;
  const setDate = onDateChange ?? setInternalDate;

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-0">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(date) => date < new Date('1900-01-01')}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
