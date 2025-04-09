'use client';

import { BucketItem } from '@/types/bucket';
import { Pencil, Trash, Star, CheckCircle, Circle, BadgeCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleFavoriteBucketItem, toggleCompletedBucketItem } from '@/firebase/firestore/private';
import { useRouter } from 'next/navigation';

interface BucketListCardProps {
  item: BucketItem;
  user: { uid: string } | null;
  onEdit: (item: BucketItem) => void;
  onDelete: (item: BucketItem) => void;
}

export default function BucketListCard({ item, user, onEdit, onDelete }: BucketListCardProps) {

  const router = useRouter();
  
  const cardStyle = `p-4 border rounded-[6px] mb-4 flex justify-between items-center transition cursor-pointer ${
    item.completed
      ? 'bg-muted border border-muted text-muted-foreground shadow-inner'
      : item.isFavorite
      ? 'border-black border-1 bg-gray-70'
      : 'border-border border-1 bg-background hover:bg-popover'
  }`;

  const badgeColor = `inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded ${
    item.completed
      ? 'border border-black text-black font-medium'
      : item.priority === 'High'
      ? 'bg-card-dark text-background'
      : item.priority === 'Medium'
      ? 'bg-gray-500 text-background'
      : 'bg-gray-400 text-background'
  }`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (date?: any) => {
    if (!date?.toDate) return '';
    return date.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => router.push(`/bucket/${item.id}`)}
      className={`${cardStyle} transition-transform cursor-pointer`}
      role="button"
      tabIndex={0}
  >
    <div className="flex-1">
      <h3 className={`text-xl font-semibold capitalize text-foreground cursor-pointer transition relative inline-flex items-center gap-[5px] ${item.completed ? 'line-through' : ''}`}>
        {item.name || 'Untitled'}
      </h3>

      <div className="max-w-2xl">
        <p className={`text-[13px] leading-tight text-muted-foreground mb-3 break-words ${item.completed ? 'line-through' : ''}`}>
          {item.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {item.createdAt && (
          <span className={`inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded border border-gray-300 text-gray-500 
            ${item.completed ? 'line-through' : ''}`}>
            <Calendar size={12} className="text-gray-500" />
            {formatDate(item.createdAt)}
          </span>
        )}

        <span className={badgeColor}>
          {item.completed ? (
            <>
              <BadgeCheck size={14} className="text-black" />
              Completed
            </>
          ) : (
            `${item.priority} Priority`
          )}
        </span>
      </div>
    </div>

    <div
      className="flex gap-3 ml-4"
      onClick={(e) => e.stopPropagation()} // prevent card click
    >
      <button
        onClick={() => onEdit(item)}
        className="text-muted-foreground hover:text-foreground transition cursor-pointer"
      >
        <Pencil size={18} />
      </button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={async (e) => {
          e.stopPropagation();
          if (user && item.id) {
            await toggleFavoriteBucketItem(user.uid, item.id, item.isFavorite ?? false);
          }
        }}
        className={`transition cursor-pointer ${
          item.isFavorite ? 'text-card-dark' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {item.isFavorite ? <Star fill="card-dark" size={18} /> : <Star size={18} />}
      </motion.button>

      <motion.button
        whileTap={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        onClick={async (e) => {
          e.stopPropagation();
          if (user && item.id) {
            await toggleCompletedBucketItem(user.uid, item.id, item.completed);
          }
        }}
        className="cursor-pointer text-muted-foreground hover:text-foreground transition"
      >
        {item.completed ? <CheckCircle size={18} className="text-black" /> : <Circle size={18} />}
      </motion.button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item);
        }}
        className="text-muted-foreground hover:text-foreground transition cursor-pointer"
      >
        <Trash size={18} />
      </button>
    </div>
  </motion.div>
  );
}
