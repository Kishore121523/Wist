'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  label: string;
  label2?: string;
  sourceComp?: string;
  disableMobileClick?: boolean; // ✅ new prop
}

export default function Tooltip({
  children,
  label,
  label2,
  sourceComp,
  disableMobileClick = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (isMobile && !disableMobileClick) {
      setIsVisible((prev) => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsVisible(false);
  };

  return (
    <div
      ref={tooltipRef}
      className="relative flex items-center justify-center group"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute top-full
            right-1/2
            sm:left-1/2 sm:right-auto sm:-translate-x-1/2 
            ${sourceComp === 'cardItems' ? 'mt-2' : 'mt-1'}
            px-3 py-1 text-[10px] rounded bg-card-dark text-background z-50
            shadow-md pointer-events-none
            max-w-[90vw] sm:max-w-fit
            whitespace-nowrap break-words text-center
          `}
        >
          <span>
            {label}
            {label2 && <p>{label2}</p>}
          </span>
        </div>
      )}
    </div>
  );
}
