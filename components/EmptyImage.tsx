import { motion } from 'framer-motion'
import React from 'react'

interface EmptyImageProps {
  filter: 'all' | 'favorites' | 'completed'
}
import { EmptyList, FavList, CompletedList } from '@/public';
import Image from 'next/image';


const EmptyImage = ({filter}:EmptyImageProps ) => {
  return (
      <motion.div
                key={`empty-${filter}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center w-full h-[350px] text-center text-muted-foreground"
              >
                <Image
                  src={
                    filter === 'favorites'
                      ? FavList
                      : filter === 'completed'
                      ? CompletedList
                      : EmptyList
                  }
                  alt="Empty State"
                  width={270}
                  height={270}
                  className="mb-4 opacity-80"
                />

                <p className="text-lg font-medium">
                  {filter === 'favorites'
                    ? 'No favorites yet!'
                    : filter === 'completed'
                    ? 'Nothing completed yet!'
                    : 'Looks like your list is empty!'}
                </p>
                <p className="text-[12px]">
                  {filter === 'favorites'
                    ? 'Mark a WIST as favorite to see it here.'
                    : filter === 'completed'
                    ? 'Tick off a WIST to mark it as done.'
                    : 'Add your first WIST to begin!'}
                </p>
              </motion.div>
  )
}

export default EmptyImage
