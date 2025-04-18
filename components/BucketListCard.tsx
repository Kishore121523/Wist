'use client';

import { BucketItem } from '@/types/bucket';
import { Pencil, Trash, Star, CheckCircle, Circle, BadgeCheck, Calendar, NotepadText } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleFavoriteBucketItem, toggleCompletedBucketItem } from '@/firebase/firestore/private';
import { useRouter } from 'next/navigation';
import { formatDate, getPriorityBadgeStyle } from '@/lib/utils';
import CardActionButton from './CardActionButton';

interface BucketListCardProps {
  item: BucketItem;
  user: { uid: string } | null;
  onEdit: (item: BucketItem) => void;
  onDelete: (item: BucketItem) => void;
}

export default function BucketListCard({ item, user, onEdit, onDelete }: BucketListCardProps) {

  const router = useRouter();
  
  const cardStyle = `p-4 border rounded-[6px] mb-5 sm:mb-4 flex justify-center items-center gap-0 sm:gap-0 transition cursor-pointer ${
  item.completed
    ? 'bg-muted border border-muted text-muted-foreground shadow-inner'
    : item.isFavorite
    ? 'border-black border-1 bg-gray-70'
    : 'border-border border-1 bg-background hover:bg-popover'
}`;

  const badgeColor = `inline-flex items-center gap-1 text-[10px] sm:text-[12px] px-2 py-0.5 rounded ${getPriorityBadgeStyle(item.priority, item.completed)}`;

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

      <div className="flex flex-wrap max-w-[80%] gap-2">
        {item.createdAt && (
          <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[12px] px-2 py-0.5 rounded border border-gray-300 text-gray-500 
            ${item.completed ? 'line-through' : ''}`}>
            <Calendar size={12} className="text-gray-500" />
            {formatDate(item.createdAt)}
          </span>
        )}

        <span className={badgeColor}>
          {item.completed ? (
            <>
              <BadgeCheck className="text-black w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" />
              Completed
            </>
          ) : (
            `${item.priority} Priority`
          )}
        </span>
        
        <span>
          {item.completed && (
            <div className={`${badgeColor} cursor-pointer hover:bg-card-dark hover:text-background transition`} onClick={(e) => {
              e.stopPropagation();
              router.push(`/bucket/${item.id}/reflections`);
            }}>
              <NotepadText className='w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]' />
              Reflections
            </div>
          )}
        </span>
      </div>
    </div>

    <div className="flex flex-wrap flex-col justify-center items-center gap-3 sm:gap-3 sm:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
      <CardActionButton
        onClick={() => onEdit(item)}
        icon={<Pencil className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />}
        tooltip="Edit"
      />

    <CardActionButton
      onClick={async (e) => {
        e.stopPropagation();
        if (user && item.id) {
          await toggleFavoriteBucketItem(user.uid, item.id, item.isFavorite ?? false);
        }
      }}
      icon={
        item.isFavorite ? <Star fill="card-dark" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" /> : <Star className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
      }
      tooltip={item.isFavorite ? 'Unfavorite' : 'Favorite'}
      highlight={item.isFavorite}
      scaleOnHover
    />

    <CardActionButton
      onClick={async (e) => {
        e.stopPropagation();
        if (user && item.id) {
          await toggleCompletedBucketItem(user.uid, item.id, item.completed);
        }
      }}
      icon={
        item.completed ? (
          <CheckCircle className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-black"/>
        ) : (
          <Circle className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
        )
      }
      tooltip={item.completed ? 'Incomplete' : 'Complete'}
    />

    <CardActionButton
      onClick={(e) => {
        e.stopPropagation();
        onDelete(item);
      }}
      icon={<Trash className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />}
      tooltip="Delete"
    />

    </div>
  </motion.div>
  );
}
