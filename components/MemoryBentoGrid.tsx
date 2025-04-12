'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { uploadMemoryPhoto } from '@/firebase/storage/uploadMemoryPhoto';
import { formatUpdatedAt } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { btnBlackBg, formInputStyle } from '@/lib/constants';
import { Textarea } from './ui/textarea';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { BucketItemDetails } from '@/types/details';
import ConfirmModal from './ConfirmModal';
import { AnimatePresence, motion } from 'framer-motion';
import AlertModal from './AlertModal';

interface Memory {
  url: string;
  comment?: string;
  uploadedAt?: Date;
  updatedAtMemoryPhoto?: Date;
}

interface Props {
  photos: Memory[];
  onChange: (updated: Memory[]) => void;
  userId: string;
  bucketId: string;
}

export default function MemoryBentoGrid({
  photos = [],
  onChange,
  userId,
  bucketId,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [comment, setComment] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchLatestPhotos = async () => {
    const ref = doc(db, 'users', userId, 'privateBucketLists', bucketId, 'details', 'info');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as BucketItemDetails;
      if (data.memoryPhotos) {
        const mapped = data.memoryPhotos.map((p) => ({
          ...p,
          uploadedAt: p.uploadedAt instanceof Timestamp ? p.uploadedAt.toDate() : p.uploadedAt,
          updatedAtMemoryPhoto:
            p.updatedAtMemoryPhoto instanceof Timestamp ? p.updatedAtMemoryPhoto.toDate() : p.updatedAtMemoryPhoto,
        }));
        onChange(mapped);
      }
    }
  };

  const saveToFirestore = async (updatedPhotos: Memory[]) => {
    const ref = doc(db, 'users', userId, 'privateBucketLists', bucketId, 'details', 'info');
    await setDoc(
      ref,
      {
        memoryPhotos: updatedPhotos.map((photo) => ({
          url: photo.url,
          comment: photo.comment || '',
          uploadedAt: photo.uploadedAt || new Date(),
          updatedAtMemoryPhoto: photo.updatedAtMemoryPhoto || null,
        })),
        updatedAtMemoryPhotos: new Date(),
      },
      { merge: true }
    );
    fetchLatestPhotos();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setAlertMessage('Please upload a valid image file (JPEG, JPG, or PNG).');
      setAlertOpen(true);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAlertMessage('Image size should be less than 5MB.');
      setAlertOpen(true);
      return;
    }

    try {
      const url = await uploadMemoryPhoto(userId, bucketId, file);
      const newMemory: Memory = {
        url,
        comment: '',
        uploadedAt: new Date(),
        updatedAtMemoryPhoto: new Date(),
      };
      const updated = [...photos, newMemory];
      await saveToFirestore(updated);
    } catch (err) {
      alert(`Failed to upload image. Please try again. Error: ${err}`);
    }
  };

  const handleEditClick = (index: number) => {
    setActiveIndex(index);
    setComment(photos[index]?.comment || '');
  };

  const handleSaveComment = async () => {
    if (activeIndex === null) return;
    const updated = [...photos];
    updated[activeIndex] = {
      ...updated[activeIndex],
      comment,
      updatedAtMemoryPhoto: new Date(),
    };
    await saveToFirestore(updated);
    setActiveIndex(null);
    setComment('');
  };

  const handleConfirmedDelete = async () => {
    if (confirmDeleteIndex === null) return;
    const updated = [...photos];
    updated.splice(confirmDeleteIndex, 1);
    await saveToFirestore(updated); // 🔥 Persist to Firestore
    setConfirmDeleteIndex(null);
  };

  useEffect(() => {
    if (userId && bucketId) {
      fetchLatestPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, bucketId]);

  return (
    <div className="space-y-6">
      <Button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="bg-muted border border-border text-foreground hover:bg-card-dark hover:text-background transition"
      >
        Upload Photo
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <AnimatePresence mode="popLayout">
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.url}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative overflow-hidden rounded-[6px] break-inside-avoid"
            >
              <Image
                src={photo.url}
                alt={`Memory ${index + 1}`}
                width={600}
                height={400}
                className="w-full rounded-[6px] object-cover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => handleEditClick(index)}
              />

              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="bg-background hover:bg-card-dark hover:text-background w-8 h-8 rounded-[6px] p-1"
                  onClick={() => setConfirmDeleteIndex(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>



    <Dialog open={activeIndex !== null} onOpenChange={() => setActiveIndex(null)}>
        <DialogContent className="bg-background max-w-md max-h-[70vh] h-[70vh] border border-border rounded-[6px] p-6 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Photo Upload Dialog</DialogTitle>
          </VisuallyHidden>

          <div className="flex justify-center items-center">
            <h2 className="text-xl font-semibold">Memory</h2>
          </div>

          {activeIndex !== null && photos[activeIndex] && (
            <>
              <div className="w-full max-h-[250px] overflow-hidden rounded-[6px] flex items-center justify-center">
                  <Image
                    src={photos[activeIndex].url}
                    alt="Preview"
                    width={500}
                    height={300}
                    className="object-contain max-h-[250px] w-auto h-auto rounded-[6px] shadow-sm"
                  />
                </div>

                {/* Textarea */}
                <Textarea
                  value={comment || ''}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your reflection about this memory..."
                  className={`${formInputStyle} resize-none max-h-[100px] min-h-[50px] overflow-y-auto rounded-[6px] text-center`}
                />

                {/* Timestamps */}
                <div className="text-xs text-muted-foreground flex items-center justify-center flex-col gap-[2px]">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    Uploaded: {photos[activeIndex].uploadedAt && formatUpdatedAt(photos[activeIndex].uploadedAt)}
                  </div>
                  {photos[activeIndex].updatedAtMemoryPhoto && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      Updated: {formatUpdatedAt(photos[activeIndex].updatedAtMemoryPhoto)}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-center items-center">
                  <Button onClick={handleSaveComment} className={`${btnBlackBg} flex w-full py-5! justify-center items-center cursor-pointer`}>Save</Button>
                </div>

            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={confirmDeleteIndex !== null}
        onClose={() => setConfirmDeleteIndex(null)}
        onConfirm={handleConfirmedDelete}
        title="Delete this memory?"
        message="This photo and its comment will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </div>
  );
}
