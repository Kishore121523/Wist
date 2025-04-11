// components/MemoryUploader.tsx
'use client';

import { ChangeEvent, useRef } from 'react';
import { uploadMemoryPhoto } from '@/firebase/storage/uploadMemoryPhoto';
import { motion } from 'framer-motion';
import { Trash2, MessageCircleMore } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';

interface Memory {
  url: string;
  comment?: string;
  uploadedAt?: Date;
}

interface Props {
  photos: Memory[];
  onChange: (photos: Memory[]) => void;
  userId: string;
  bucketId: string;
}

export default function MemoryUploader({
  photos,
  onChange,
  userId,
  bucketId,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadMemoryPhoto(userId, bucketId, file);
      const newMemory: Memory = {
        url,
        comment: '',
        uploadedAt: new Date(),
      };
      onChange([...photos, newMemory]);
    } catch (err) {
      alert(`Failed to upload image. Please try again. Error: ${err}`);
    }
  };

  const handleCommentChange = (index: number, value: string) => {
    const updated = [...photos];
    updated[index].comment = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...photos];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <Button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="bg-muted border border-border text-foreground hover:bg-card-dark hover:text-background transition"
      >
        Upload Photo
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Photo Previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.url}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="relative border border-border rounded-md overflow-hidden shadow-sm"
          >
            <Image
              src={photo.url}
              alt={`Memory ${index + 1}`}
              width={300}
              height={200}
              className="w-full h-[200px] object-cover"
            />

            {/* Top-right actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="bg-background hover:bg-muted w-8 h-8 rounded-full p-1"
                onClick={() => handleRemove(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>

            {/* Comment input */}
            <div className="p-3 border-t border-border bg-background">
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <MessageCircleMore size={12} /> Memory / Comment
              </label>
              <Input
                placeholder="Write something about this moment..."
                value={photo.comment || ''}
                onChange={(e) => handleCommentChange(index, e.target.value)}
                className="text-sm"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
