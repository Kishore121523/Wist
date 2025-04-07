'use client';

import { ReactNode } from 'react';

export default function Tooltip({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition z-10 pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
