'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { BucketItem } from '@/types/bucket';
import {
  listenToPrivateBucketLists,
  deletePrivateBucketItem,
} from '@/firebase/firestore/private';
import BucketListFormModal from '@/components/BucketListFormModal';
import BucketListCard from '@/components/BucketListCard';
import {
  ToggleGroup,
} from '@/components/ui/toggle-group';

import { List, Star, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyImage from '@/components/EmptyImage';
import Loader from '@/components/Loader';
import ViewToggleButton from '@/components/ToggleButton';
import ConfirmModal from '@/components/ConfirmModal';
import { getGreeting, containerVariants, itemVariants } from '@/lib/utils';
import { btnBlackBg, btnWhiteBg } from '@/lib/constants';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BucketItem | undefined>();
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<BucketItem | null>(null);

  const [filter, setFilter] = useState<'all' | 'favorites' | 'completed'>('all');

  useEffect(() => {
    if (!loading && !user) router.push('/');
    if (user) {
      const unsub = listenToPrivateBucketLists(user.uid, setItems);
      return () => unsub();
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const openNewItemModal = () => {
    setSelectedItem(undefined);
    setModalOpen(true);
  };

  const openEditModal = (item: BucketItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (confirmDeleteItem && user?.uid && confirmDeleteItem.id) {
      await deletePrivateBucketItem(user.uid, confirmDeleteItem.id);
      setConfirmDeleteItem(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'favorites') return item.isFavorite;
    if (filter === 'completed') return item.completed;
    return true;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex justify-center items-start px-6 sm:px-8 md:px-12 lg:px-[12rem] py-12 sm:py-24 bg-background text-foreground">
      <div className="flex flex-col w-full max-w-4xl">

        {/* Head*/}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-muted-foreground capitalize">
            {getGreeting()},
            <p className="text-3xl sm:text-4xl text-foreground">{user?.displayName || user?.email}</p>
          </h1>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
            <button
              onClick={openNewItemModal}
              className={btnBlackBg}>
              Add a WIST
            </button>

            <button
              onClick={handleSignOut}
              className={btnWhiteBg}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 overflow-x-auto">
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(val) => {
              if (val) setFilter(val as 'all' | 'favorites' | 'completed');
            }}
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
              <ViewToggleButton value="all">
                <List className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" />
                All
              </ViewToggleButton>

              <ViewToggleButton value="favorites">
                <Star className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" />
                Favorites
              </ViewToggleButton>

              <ViewToggleButton value="completed">
                <CheckCircle className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" />
                Completed
              </ViewToggleButton>

          </ToggleGroup>
        </div>
        
        {/* Bucket List Items */}
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-3">
          Your WIST.
      </h2>

        {/* Items */}
        <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key={filter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <BucketListCard
                      item={item}
                      user={user}
                      onEdit={openEditModal}
                      onDelete={(item) => setConfirmDeleteItem(item)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyImage filter={filter} />
            )}
        </AnimatePresence>
      </div>

    {/* Modals */}
    <BucketListFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTimeout(() => {
            setSelectedItem(undefined);
          }, 300); 
        }}
        existingItem={selectedItem}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteItem}
        onClose={() => setConfirmDeleteItem(null) }
        onConfirm={handleDeleteConfirmed}
        title={`Delete “${confirmDeleteItem?.name || ''}”?`}
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
