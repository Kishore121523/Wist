'use client';

import { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import Skeleton from '@/components/Skeleton';

interface Props extends Omit<ImageProps, 'onLoad'> {
  delay?: number;
}

export default function ImageWithSkeleton({ delay = 1000, ...props }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDelayPassed(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const fullyReady = isLoaded && delayPassed;

  return (
    <div className="relative w-full">
      {!fullyReady && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-[6px]" />
        </div>
      )}

      <Image
        {...props}
        className={`${
          fullyReady ? 'opacity-100' : 'opacity-0'
        } ${props.className || ''}`}
        onLoad={() => setIsLoaded(true)}
        alt='Preview'
        width={props.width || 500}
        height={props.height || 300}
      />
    </div>
  );
}


