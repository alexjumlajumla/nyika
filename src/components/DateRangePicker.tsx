'use client';

import { useState } from 'react';
import { addDays, format, isAfter, isBefore, isSameDay } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  onSelect?: (range: { from: Date; to: Date } | undefined) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}

export function DateRangePicker({
  onSelect,
  className,
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  disabledDates = [],
}: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    if (selectedRange?.from && selectedRange?.to) {
      setIsOpen(false);
      onSelect?.({
        from: selectedRange.from,
        to: selectedRange.to,
      });
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
    onSelect?.(undefined);
  };

  const isDateDisabled = (date: Date) => {
    return (
      isBefore(date, minDate) ||
      isAfter(date, maxDate) ||
      disabledDates.some((disabledDate) => isSameDay(disabledDate, date))
    );
  };

  const getDisplayText = () => {
    if (!range?.from) return 'Select dates';
    if (!range.to) return format(range.from, 'MMM d, yyyy');
    return `${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d, yyyy')}`;
  };

  return (
    <div className={cn('relative', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !range && 'text-muted-foreground',
              'group relative overflow-hidden bg-white/95 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 border border-gray-200 hover:border-primary/50',
              'hover:shadow-md transform hover:-translate-y-0.5',
              'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300',
              'after:absolute after:inset-0 after:ring-1 after:ring-inset after:ring-white/50 after:rounded-md',
              'dark:bg-gray-900/80 dark:border-gray-700 dark:hover:border-primary/50 dark:shadow-black/20',
              'dark:before:from-primary/10 dark:before:to-transparent',
              'dark:after:ring-white/10'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary/70 transition-colors group-hover:text-primary" />
            <span>{getDisplayText()}</span>
            {range?.from && (
              <button
                onClick={clearSelection}
                className="ml-auto rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto overflow-hidden rounded-xl border-0 bg-white p-0 shadow-xl dark:bg-gray-900"
          align="start"
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            defaultMonth={range?.from || new Date()}
            numberOfMonths={2}
            pagedNavigation
            className="p-4"
            classNames={{
              root: 'font-sans',
              months: 'flex flex-col sm:flex-row gap-4',
              month: 'space-y-4',
              caption: 'flex justify-between items-center px-2 pt-1 relative',
              caption_label: 'text-sm font-medium',
              nav: 'flex items-center',
              nav_button: 'h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800',
              nav_button_previous: 'absolute left-2',
              nav_button_next: 'absolute right-2',
              table: 'w-full border-collapse',
              head_row: 'flex',
              head_cell: 'text-muted-foreground rounded-md w-10 text-xs font-normal',
              row: 'flex w-full mt-1',
              cell: 'h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent',
              day: 'h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-full flex items-center justify-center',
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
              day_today: 'border border-primary/50',
              day_disabled: 'text-muted-foreground opacity-50',
              day_outside: 'text-muted-foreground opacity-30',
              day_range_middle: 'bg-accent rounded-none',
              day_hidden: 'invisible',
            }}
            modifiers={{
              start: range?.from ? [range.from] : [],
              end: range?.to ? [range.to] : [],
            }}
            modifiersStyles={{
              start: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                borderRadius: '9999px',
              },
              end: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                borderRadius: '9999px',
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
