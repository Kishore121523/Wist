'use client';

import { ReactNode } from 'react';
import { ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
  value: string;
  children: ReactNode;
}

export default function ViewToggleButton({ value, children }: Props) {
  return (
    <ToggleGroupItem
      value={value}
      className={`h-7 sm:h-9 flex items-center justify-center gap-1 px-2 py-[8px] sm:px-4 sm:py-2 text-[10px] sm:text-[12px] min-w-auto sm:min-w-[6rem]
              border border-border  data-[state=on]:rounded-[6px] data-[state=off]:rounded-[6px]
              data-[state=on]:bg-card-dark data-[state=on]:text-background data-[state=on]:border-card-dark
              hover:cursor-pointer hover:border-card-dark hover:bg-card-dark hover:text-background
              transition whitespace-nowrap`}
    >
      {children}
    </ToggleGroupItem>
  );
}
