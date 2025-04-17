'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton from '@/components/Skeleton';

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ImagePreviewWithSkeleton({
  src,
  alt = 'Preview',
  width = 500,
  height = 300,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);

  // Trigger 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayPassed(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fullyReady = isLoaded && delayPassed;

  return (
    <div className="w-full max-h-[250px] overflow-hidden rounded-[6px] flex items-center justify-center relative bg-muted/10">
      {/* Skeleton above image until both conditions are met */}
      {!fullyReady && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-[6px]" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain max-h-[250px] w-auto h-auto rounded-[6px] shadow-sm transition-opacity duration-300 ${
          fullyReady ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
