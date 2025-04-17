// components/ui/Skeleton.tsx
import React from 'react';

export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted/40 rounded-[6px] ${className}`} />
  );
}
