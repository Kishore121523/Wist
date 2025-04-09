'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface DatePickerProps {
  date?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
}

export function DatePicker({ date, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
            className={cn(
            'w-[180px] justify-center text-center font-normal border border-card-dark rounded-[6px] hover:bg-card-dark hover:text-background transition cursor-pointer',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 rounded-[6px]" align="center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(val) => {
            if (val) {
              onChange(val);
              setOpen(false);
            }
          }}
          disabled={{ before: new Date() }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
