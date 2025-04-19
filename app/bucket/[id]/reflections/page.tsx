'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import BucketItemHeader from '@/components/BuckeItemHeader';

import { ArrowLeft, LayoutDashboard } from 'lucide-react';

import { BucketItem } from '@/types/bucket';
import { BucketItemDetails } from '@/types/details';
import { getRandomImage } from '@/lib/utils';
import {  btnWhiteBg } from '@/lib/constants';
import Image from 'next/image';
import MemoryBentoGrid from '@/components/MemoryBentoGrid';
import ThemeToggleBtn from '@/components/ThemeToggleBtn';

export default function ReflectionPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState<BucketItem | null>(null);
  const [photos, setPhotos] = useState<BucketItemDetails['memoryPhotos']>([]);

const heroImages = [
  '/assets/card1.svg',
  '/assets/card2.svg',
  '/assets/card3.svg',
  '/assets/card4.svg',
  '/assets/card5.svg',
  '/assets/card6.svg',
  '/assets/card7.svg',
  '/assets/card8.svg',
  '/assets/card9.svg',
  '/assets/card10.svg',
  '/assets/card11.svg',
];
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
  };

  useEffect(() => {
    fetchItem();
    fetchMemories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  if (!item) return <Loader />;

  return (
    <div className="min-h-screen flex justify-center items-start px-6 sm:px-8 md:px-12 lg:px-[12rem] py-10 sm:py-20 bg-background text-foreground">
      <div className="flex flex-col w-full max-w-4xl 2xl:max-w-6xl">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <Button onClick={() => router.back()} className={btnWhiteBg}>
          <ArrowLeft size={16} className="mr-[-3px]" />
          Go back
        </Button>

        <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">

        <ThemeToggleBtn />
        <Button onClick={() => router.push(`/dashboard`)} className={btnWhiteBg}>
          <LayoutDashboard className='mx-[-2px] h-[2px]' /> Dashboard
        </Button>
        </div>
      </div>

      {/* Item Card */}
      <div className="border border-border rounded-[8px] p-6 sm:p-8 mb-6 sm:mb-8 bg-card-dark shadow-sm transition flex justify-between items-center">
        <BucketItemHeader
          item={item}
          user={user}
          disableToggle={true}
        />

        <div className="hidden sm:flex w-[100px] h-[100px] rounded-md overflow-hidden items-center justify-center ml-6 mr-3">
          <Image
            src={randomImage}
            alt="Hero"
            width={100}
            height={100}
            className="object-contain max-w-full max-h-full dark:invert dark:contrast-80"
          />
        </div>
      </div>

      {/* Memory Upload UI */}
      <div className="border border-border rounded-[8px] p-4 sm:p-6 mb-6 bg-background shadow-sm transition">
        <MemoryBentoGrid
          photos={(photos || []).map(photo => ({
            ...photo,
            uploadedAt: photo.uploadedAt instanceof Timestamp ? photo.uploadedAt.toDate() : photo.uploadedAt,
          }))}
          onChange={setPhotos}
          userId={user?.uid || ''}
          bucketId={id as string}
        />
      </div>
      </div>
      </div>
  );
}
