'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  label: string;
  label2?: string;
  sourceComp?: string;
}

export default function Tooltip({ children, label, label2, sourceComp }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // ✅ Close tooltip on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div
      ref={tooltipRef}
      className="relative flex items-center justify-center group"
      onClick={() => {
        if (isMobile) setIsVisible((prev) => !prev);
      }}
      onMouseEnter={() => {
        if (!isMobile) setIsVisible(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsVisible(false);
      }}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute top-full
            right-1/2
            sm:left-1/2 sm:right-auto sm:-translate-x-1/2 
            ${sourceComp === 'cardItems' ? 'mt-2' : 'mt-1'}
            px-3 py-1 text-[10px] rounded bg-card-dark text-white z-50
            shadow-md pointer-events-none
            max-w-[90vw] sm:max-w-fit
            whitespace-nowrap break-words text-center
          `}
        >

          <span className="hidden sm:inline">
            {label}
            {label2 && <p>{label2}</p> }
          </span>

          <div className="block sm:hidden text-center">
            <p>{label}</p>
            {label2 && <p>{label2}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
