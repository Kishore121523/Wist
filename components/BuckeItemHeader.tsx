'use client';

import { BucketItem } from '@/types/bucket';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface Props {
  item: BucketItem;
  user: { uid: string } | null;
  onToggleComplete: () => void;
}

export default function BucketItemHeader({ item, onToggleComplete }: Props) {
  return (
    <div className="opacity-90 max-w-[calc(100%-140px)]">
      <h1 className="text-4xl font-bold text-background mb-1">
        {item.name || 'Untitled'}
      </h1>

      <p className="text-background mb-3 text-md break-words">
        {item.description || 'No description provided.'}
      </p>

      <div className="flex flex-wrap gap-2 text-background">
        <Badge className="border border-border rounded-[6px]">
          {item.category?.trim() ? item.category : 'General'}
        </Badge>

        <Badge className="border border-border rounded-[6px]">
          {item.priority ? `${item.priority} Priority` : 'No Priority'}
        </Badge>

        <Badge
          className={`flex items-center justify-center border border-border rounded-[6px] ${
            item.completed
              ? 'bg-background text-card-dark'
              : 'bg-card-dark text-background'
          }`}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            onClick={onToggleComplete}
            className="flex items-center gap-1 text-xs cursor-pointer"
          >
            {item.completed ? (
              <CheckCircle size={14} className="text-card-dark" />
            ) : (
              <Circle size={14} className="text-background" />
            )}
            {item.completed ? 'Completed' : 'Mark as Completed'}
          </motion.button>
        </Badge>
      </div>
    </div>
  );
}
