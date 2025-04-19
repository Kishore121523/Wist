'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface EmptyImageProps {
  filter: 'all' | 'favorites' | 'completed';
}

const EmptyImage = ({ filter }: EmptyImageProps) => {
  const getImageSrc = () => {
    if (filter === 'favorites') return '/assets/FavList.svg';
    if (filter === 'completed') return '/assets/CompletedList.svg';
    return '/assets/EmptyList.svg';
  };

  return (
    <motion.div
      key={`empty-${filter}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center w-full h-[370px] text-center text-muted-foreground"
    >
      <Image
          src={getImageSrc()}
          alt="Empty State"
          width={270}
          height={270}
          className="mb-4 opacity-100 dark:invert dark:contrast-30 w-[200px] sm:w-[220px] md:w-[240px] lg:w-[270px] 2xl:w-[320px] h-auto"
        />

      <p className="text-md sm:text-lg font-medium">
        {filter === 'favorites'
          ? 'No favorites yet!'
          : filter === 'completed'
          ? 'Nothing completed yet!'
          : 'Looks like your list is empty!'}
      </p>
      <p className="text-[10px] sm:text-[12px]">
        {filter === 'favorites'
          ? 'Mark a WIST as favorite to see it here.'
          : filter === 'completed'
          ? 'Tick off a WIST to mark it as done.'
          : 'Add your first WIST to begin!'}
      </p>
    </motion.div>
  );
};

export default EmptyImage;
