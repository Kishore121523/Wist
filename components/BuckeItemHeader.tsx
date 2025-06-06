'use client';

import { BucketItem } from '@/types/bucket';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Props {
  item: BucketItem;
  user: { uid: string } | null;
  onToggleComplete?: () => void; 
  disableToggle?: boolean;
}

export default function BucketItemHeader({ item, onToggleComplete, disableToggle = false }: Props) {
  const completed = item.completed;

  return (
    <div className="opacity-90 max-w-[90%] sm:max-w-[calc(100%-180px)]">
      <h1 className="text-3xl sm:text-4xl font-bold text-background mb-2">
        {item.name || 'Untitled'}
      </h1>

      <p className="text-background text-[13px] mb-3 text-md break-words">
        {item.description || 'No description provided.'}
      </p>

      <div className="flex items-center sm:flex-wrap gap-2 text-background">
        <Badge className="text-[10px] sm:text-[12px] border border-border rounded-[6px]">
          {item.category?.trim() ? item.category : 'General'}
        </Badge>

        <Badge className="text-[10px] sm:text-[12px] border border-border rounded-[6px]">
          {item.priority ? `${item.priority} Priority` : 'No Priority'}
        </Badge>

        <Badge
          className={`flex items-center justify-center border border-border rounded-[6px] ${
            completed ? 'bg-background text-card-dark-2' : 'bg-card-dark-2 text-background'
          }`}
        >
          {disableToggle ? (
            <>
              <CheckCircle size={14} className="text-card-dark-2" />
              <span className="text-[10px] sm:text-[12px] ml-0">Completed</span>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
              onClick={onToggleComplete}
              className="flex items-center gap-1 cursor-pointer text-[10px] sm:text-[12px]"
            >
              {completed ? (
                <CheckCircle size={14} className="text-card-dark-2" />
              ) : (<></>) }
              {completed ? 'Completed' : 'Mark as Completed'}
            </motion.button>
          )}
        </Badge>
      </div>
    </div>
  );
}
