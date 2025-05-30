'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getBucketItemDetails, setBucketItemDetails } from '@/firebase/firestore/details';
import { getDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { Pencil, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import BucketListFormModal from '@/components/BucketListFormModal';
import PlanningEditor from '@/components/PlanningEditor';
import Loader from '@/components/Loader';
import DateInputsWithCountdown from '@/components/DateInputsWithCountdown';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

import { BucketItem } from '@/types/bucket';
import { BucketItemDetails } from '@/types/details';
import {
  formatUpdatedAt,
  getRandomImage,
  containerVariants2,
  itemVariants2,
} from '@/lib/utils';
import { btnBlackBg, btnWhiteBg } from '@/lib/constants';
import Tooltip from '@/components/Tooltip';
import { toggleCompletedBucketItem } from '@/firebase/firestore/private';
import BucketItemHeader from '@/components/BuckeItemHeader';
import ThemeToggleBtn from '@/components/ThemeToggleBtn';
import AISuggestionModal from '@/components/AISuggestionModal';

export default function BucketDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [saved, setSaved] = useState(false);
  const [item, setItem] = useState<BucketItem | null>(null);
  const [details, setDetails] = useState<BucketItemDetails>({
    planningNotes: '',
    expectedStartDate: undefined,
    expectedEndDate: undefined,
  });
  const [originalDetails, setOriginalDetails] = useState<BucketItemDetails>({
    planningNotes: '',
    expectedStartDate: undefined,
    expectedEndDate: undefined,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

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

  const randomImage = useMemo(() => getRandomImage(heroImages), []);

  const fetchItem = async () => {
    if (!user || !id) return;
    const docRef = doc(db, 'users', user.uid, 'privateBucketLists', id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setItem({ id: docSnap.id, ...docSnap.data() } as BucketItem);
    }
  };

  const fetchDetails = async () => {
    if (!user || !id) return;
    const detail = await getBucketItemDetails(user.uid, id as string);

    if (detail) {
      const parsed: BucketItemDetails = {
        planningNotes: detail.planningNotes || '',
        expectedStartDate:
          detail.expectedStartDate instanceof Timestamp
            ? detail.expectedStartDate.toDate()
            : detail.expectedStartDate,
        expectedEndDate:
          detail.expectedEndDate instanceof Timestamp
            ? detail.expectedEndDate.toDate()
            : detail.expectedEndDate,
        updatedAtPlanning:
          detail.updatedAtPlanning instanceof Timestamp
            ? detail.updatedAtPlanning.toDate()
            : detail.updatedAtPlanning,
      };

      setDetails(parsed);
      setOriginalDetails(parsed);
    }
  };

  const hasUnsavedChanges =
    JSON.stringify(details.planningNotes) !== JSON.stringify(originalDetails.planningNotes) ||
    details.expectedStartDate?.toString() !== originalDetails.expectedStartDate?.toString() ||
    details.expectedEndDate?.toString() !== originalDetails.expectedEndDate?.toString();

  useEffect(() => {
    fetchItem();
    fetchDetails();
  }, [user, id]);

  const handleSave = async () => {
    if (!user || !id) return;
    const { planningNotes, expectedStartDate, expectedEndDate } = details;
    if (!expectedStartDate || !expectedEndDate) {
      alert('Please select both start and end dates before saving.');
      return;
    }
    if (expectedStartDate > expectedEndDate) {
      alert('Start date cannot be after the end date.');
      return;
    }
    const cleanDetails: BucketItemDetails = {
      planningNotes: planningNotes || '',
      expectedStartDate,
      expectedEndDate,
      updatedAtPlanning: new Date(),
    };

    try {
      await setBucketItemDetails(user.uid, id as string, cleanDetails);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setDetails((prev) => ({ ...prev, updatedAtPlanning: new Date() }));
      setOriginalDetails({ ...cleanDetails });
    } catch (error) {
      alert(`Failed to save changes. Please try again. ${error}`);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setUnsavedDialogOpen(true);
    } else {
      router.back();
    }
  };

  if (!item) return <Loader />;

  return (
    <motion.div
      variants={containerVariants2}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex justify-center items-start px-6 sm:px-8 md:px-12 lg:px-[12rem] py-10 sm:py-20 bg-background text-foreground"
    >
      <div className="flex flex-col w-full max-w-4xl 2xl:max-w-6xl">
        {/* Top bar */}
        <motion.div variants={itemVariants2}>
          <div className="flex flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
            <Button onClick={handleBack} className={btnWhiteBg}>
              <ArrowLeft className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] mr-[-3px]" />
              Go back
            </Button>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
              <ThemeToggleBtn />
              <Button className={btnWhiteBg} onClick={() => setEditModalOpen(true)}>
                <Pencil className="mx-[-2px] w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]" />
                Edit
              </Button>
            </div>
          </div>
        </motion.div>

        {/* List Card Details */}
        <motion.div variants={itemVariants2}>
          <div className="border border-border rounded-[8px] p-6 sm:p-8 mb-6 sm:mb-8 bg-card-dark-2 shadow-sm transition flex justify-between items-center">
            <BucketItemHeader
              item={item}
              user={user}
              onToggleComplete={async () => {
                if (!user || !item.id) return;
                await toggleCompletedBucketItem(user.uid, item.id, item.completed);
                fetchItem();
              }}
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
        </motion.div>

        {/* Date Inputs */}
        <motion.div variants={itemVariants2}>
          <div className="border border-border rounded-[8px] p-4 sm:p-6 mb-6 sm:mb-8 bg-background shadow-sm transition">
            <DateInputsWithCountdown
              startDate={details.expectedStartDate}
              endDate={details.expectedEndDate}
              onChangeStart={(date) => setDetails({ ...details, expectedStartDate: date })}
              onChangeEnd={(date) => setDetails({ ...details, expectedEndDate: date })}
            />
          </div>
        </motion.div>

        {/* Planning Notes */}
        <motion.div variants={itemVariants2}>
          <div className="border border-border rounded-[8px] p-4 sm:p-6 bg-background mb-6 shadow-sm transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-2">
              <label className="text-sm font-medium">Planning Notes</label>
              {details.updatedAtPlanning && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {formatUpdatedAt(details.updatedAtPlanning)}
                </p>
              )}
            </div>
            <PlanningEditor
              content={details.planningNotes || ''}
              onChange={(value) => setDetails({ ...details, planningNotes: value })}
            />
            <Button
              onClick={() => setAiModalOpen(true)}
              className="text-xs mt-1 cursor-pointer p-[4px]! inline-flex items-center gap-1 hover:no-underline"
              variant="link"
            >
              <span className="group relative inline-flex items-center gap-1 cursor-pointer">
                <Sparkles
                  size={14}
                  className="text-muted-foreground group-hover:text-rose-400 transition-colors duration-500"
                />

                {/* Default text */}
                <span className="text-sm text-muted-foreground transition-opacity duration-500 opacity-100 group-hover:opacity-0">
                  Get AI Suggestions
                </span>

                {/* Gradient hover text */}
                <span className="absolute left-5 text-sm bg-gradient-to-r from-pink-500 via-rose-400 to-amber-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Get AI Suggestions
                </span>
              </span>
            </Button>
          </div>
        </motion.div>

        {/* Save + Reflections */}
        <motion.div variants={itemVariants2}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={handleSave}
                disabled={
                  !details.expectedStartDate ||
                  !details.expectedEndDate ||
                  details.expectedStartDate > details.expectedEndDate ||
                  !hasUnsavedChanges
                }
                className={btnBlackBg}
              >
                Save Changes
              </Button>
              <AnimatePresence>
                {saved ? (
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
                ) :
                  (!details.expectedStartDate ||
                    !details.expectedEndDate ||
                    details.expectedStartDate > details.expectedEndDate) && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-muted-foreground"
                    >
                      {!details.expectedStartDate || !details.expectedEndDate
                        ? 'Please select both dates.'
                        : 'Start date must be before end date.'}
                    </motion.p>
                  )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip
                label={item.completed ? 'Time to drop a memory' : 'Available after completion'}
                disableMobileClick
              >
                <Button
                  onClick={() => router.push(`/bucket/${item.id}/reflections`)}
                  disabled={!item.completed}
                  className={btnBlackBg}
                >
                  Reflections
                  <ArrowRight size={16} className="ml-[-3px]" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        {/* Modals */}
        {item && (
          <BucketListFormModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              fetchItem();
            }}
            existingItem={item}
          />
        )}

        <ConfirmModal
          isOpen={unsavedDialogOpen}
          onClose={() => setUnsavedDialogOpen(false)}
          onConfirm={() => {
            setUnsavedDialogOpen(false);
            router.back();
          }}
          title="Discard unsaved changes?"
          message="You have unsaved changes. Are you sure you want to go back? Your changes will be lost."
          cancelLabel="Keep Editing"
          confirmLabel="Discard Changes"
        />

        <AISuggestionModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          onInsert={(text) => {
            setDetails((prev) => {
              const existing = prev.planningNotes;
          
              const aiStart = '<!-- AI_START -->';
              const aiEnd = '<!-- AI_END -->';
          
              const newAiWrapped = `${aiStart}\n${text}\n${aiEnd}`;
          
              let updated;
          
              if (existing?.includes(aiStart) && existing?.includes(aiEnd)) {
                // Replace existing AI section
                updated = existing?.replace(
                  new RegExp(`${aiStart}[\\s\\S]*?${aiEnd}`),
                  newAiWrapped
                );
              } else {
                // Append AI section after manual content
                updated = `${existing?.trim()}\n\n${newAiWrapped}`;
              }
          
              return { ...prev, planningNotes: updated };
            });
          
            setAiModalOpen(false);
          }}
          
          title={item?.name || ''}
          category={item?.category || ''}
        />
      </div>
    </motion.div>
  );
}