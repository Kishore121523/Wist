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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

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

  const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex justify-center items-start px-[10rem] py-24 bg-background text-foreground">
      <div className="flex flex-col w-full max-w-4xl">

        {/* Head*/}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-muted-foreground capitalize">
            {getGreeting()},
            <p className="text-4xl text-foreground">{user?.displayName || user?.email}</p>
          </h1>
          <div className="flex gap-[1rem]">
            <button
              onClick={openNewItemModal}
              className="bg-card-dark text-background px-4 py-2 rounded-[6px] text-[12px] font-medium cursor-pointer border border-foreground hover:bg-foreground transition duration-200 ease-in-out">
              Add a WIST
            </button>

            <button
              onClick={handleSignOut}
              className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-card-dark hover:text-background transition">
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(val) => {
              if (val) setFilter(val as 'all' | 'favorites' | 'completed');
            }}
            className="flex gap-3"
          >
              <ViewToggleButton value="all">
                <List size={14} />
                All
              </ViewToggleButton>

              <ViewToggleButton value="favorites">
                <Star size={14} />
                Favorites
              </ViewToggleButton>

              <ViewToggleButton value="completed">
                <CheckCircle size={14} />
                Completed
              </ViewToggleButton>

          </ToggleGroup>
        </div>
        
        {/* Bucket List Items */}
        <h2 className="text-xl font-bold mb-3">Your WIST.</h2>

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
