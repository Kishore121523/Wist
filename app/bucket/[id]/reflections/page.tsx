'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import ConfirmModal from '@/components/ConfirmModal';
import MemoryUploader from '@/components/MemoryUploader';
import BucketItemHeader from '@/components/BuckeItemHeader';

import { CheckCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { BucketItem } from '@/types/bucket';
import { BucketItemDetails } from '@/types/details';
import { formatUpdatedAt, getRandomImage } from '@/lib/utils';
import { btnBlackBg, btnWhiteBg } from '@/lib/constants';
import {
  card1, card2, card3, card4, card5, card6,
  card7, card8, card9, card10, card11
} from '@/public';
import Image from 'next/image';
import { toggleCompletedBucketItem } from '@/firebase/firestore/private';

export default function ReflectionPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState<BucketItem | null>(null);
  const [photos, setPhotos] = useState<BucketItemDetails['memoryPhotos']>([]);
  const [originalPhotos, setOriginalPhotos] = useState<BucketItemDetails['memoryPhotos']>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>();
  const [saved, setSaved] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);

  const heroImages = [card1, card2, card3, card4, card5, card6, card7, card8, card9, card10, card11];
  const randomImage = useMemo(() => getRandomImage(heroImages), []);

  const fetchItem = async () => {
    if (!user || !id) return;
    const ref = doc(db, 'users', user.uid, 'privateBucketLists', id as string);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setItem({ id: snap.id, ...snap.data() } as BucketItem);
    }
  };

  const fetchMemories = async () => {
    if (!user || !id) return;
    const ref = doc(db, 'users', user.uid, 'privateBucketLists', id as string, 'details', 'info');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as BucketItemDetails;
      const photoList = data.memoryPhotos || [];
      setPhotos(photoList);
      setOriginalPhotos(photoList);
      setUpdatedAt(
        data.updatedAtMemoryPhotos instanceof Timestamp
          ? data.updatedAtMemoryPhotos.toDate()
          : data.updatedAtMemoryPhotos
      );
    }
  };

  const handleSave = async () => {
    if (!user || !id) return;
    const now = new Date();
    const ref = doc(db, 'users', user.uid, 'privateBucketLists', id as string, 'details', 'info');
    await setDoc(ref, {
      memoryPhotos: photos,
      updatedAtMemoryPhotos: now,
    }, { merge: true });

    setSaved(true);
    setUpdatedAt(now);
    setOriginalPhotos(photos);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasUnsavedChanges = JSON.stringify(photos) !== JSON.stringify(originalPhotos);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setUnsavedDialogOpen(true);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    fetchItem();
    fetchMemories();
  }, [user, id]);

  if (!item) return <Loader />;

  return (
    <div className="min-h-screen px-[10rem] py-24 bg-background text-foreground">
      
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Button onClick={handleBack} className={btnWhiteBg}>
          <ArrowLeft size={16} className="mr-[-3px]" />
          Go back
        </Button>

        <Button onClick={() => router.push(`/dashboard`)} className={btnWhiteBg}>
          <LayoutDashboard className='mx-[-2px] h-[2px]' /> Dashboard
        </Button>
      </div>

      {/* Item Card */}
      <div className="border border-border rounded-[8px] p-8 mb-8 bg-card-dark shadow-sm transition flex justify-between items-center">
        <BucketItemHeader
          item={item}
          user={user}
          onToggleComplete={async () => {
            if (!user || !item.id) return;
            await toggleCompletedBucketItem(user.uid, item.id, item.completed);
            fetchItem(); 
          }}
        />

        <div className="w-[100px] h-[100px] rounded-md overflow-hidden flex items-center justify-center ml-6 mr-3">
          <Image
            src={randomImage}
            alt="Hero"
            width={100}
            height={100}
            className="object-contain max-w-full max-h-full"
          />
        </div>
      </div>

      {/* Memory Upload UI */}
      <div className="border border-border rounded-[8px] p-6 mb-6 bg-background shadow-sm transition">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Memories & Reflections</label>
          {updatedAt && (
            <p className="text-xs text-muted-foreground">
              Last updated: {formatUpdatedAt(updatedAt)}
            </p>
          )}
        </div>
        <MemoryUploader
          photos={(photos || []).map(photo => ({
            ...photo,
            uploadedAt: photo.uploadedAt instanceof Timestamp ? photo.uploadedAt.toDate() : photo.uploadedAt,
          }))}
          onChange={setPhotos}
          userId={user?.uid || ''}
          bucketId={id as string}
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={!hasUnsavedChanges} className={btnBlackBg}>
          Save Memories
        </Button>

        <AnimatePresence>
          {saved && (
            <motion.div
              key="check"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center text-md text-foreground"
            >
              <CheckCircle size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unsaved Modal */}
      <ConfirmModal
        isOpen={unsavedDialogOpen}
        onClose={() => setUnsavedDialogOpen(false)}
        onConfirm={() => {
          setUnsavedDialogOpen(false);
          router.back();
        }}
        title="Discard unsaved changes?"
        message="You have unsaved photo comments or uploads. Are you sure you want to go back?"
        cancelLabel="Keep Editing"
        confirmLabel="Discard Changes"
      />
    </div>
  );
}
