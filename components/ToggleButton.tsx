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
      className="flex items-center justify-center gap-1 min-w-[2rem] px-4 py-2 text-[12px] border border-border
        data-[state=off]:rounded-[6px] data-[state=on]:rounded-[6px] data-[state=on]:bg-card-dark data-[state=on]:text-background
        hover:cursor-pointer data-[state=on]:border-card-dark hover:border-card-dark hover:bg-card-dark hover:text-background transition"
    >
      {children}
    </ToggleGroupItem>
  );
}
