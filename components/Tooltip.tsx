'use client';

import { ReactNode } from 'react';

export default function Tooltip({
  children,
  label,
  label2,
  sourceComp
}: {
  children: ReactNode;
  label: string;
  label2?: string;
  sourceComp?: string;
}) {
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <p className={`absolute bottom-full left-1/2 -translate-x-1/2 ${sourceComp === 'cardItems' ? 'mb-2' : 'mb-1'} px-2 py-0.5 text-[10px] rounded bg-black text-white text-center opacity-0 group-hover:opacity-100 transition z-10 pointer-events-none whitespace-nowrap`}>
        {label}
        {label2 && <p className=""> {label2}</p>}
      </p>
    
    </div>
  );
}
