'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { BucketItem } from '@/types/bucket';
import { listenToPrivateBucketLists, deletePrivateBucketItem } from '@/firebase/firestore/private';
import BucketListFormModal from '@/components/BucketListFormModal';
import BucketListCard from '@/components/BucketListCard';
import DeleteConfirmModal from '@/components/DeleteConfirmationModal';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BucketItem | undefined>();
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<BucketItem | null>(null);

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


  return (
  <div className="min-h-screen flex justify-center items-start px-[10rem] py-24 bg-background text-foreground">
      <div className="flex flex-col w-full max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold text-muted-foreground capitalize">
            {getGreeting()},
            <p className="text-4xl text-foreground">{user?.displayName || user?.email}</p>
          </h1>
          <div className="flex gap-[1.5rem]">
              <button
                onClick={openNewItemModal}
                className="bg-foreground text-background px-4 py-2 rounded-[6px] text-[12px] font-medium cursor-pointer border border-foreground hover:border-gray-100 transition duration-200 ease-in-out"
              >
                Add a WIST
              </button>

              <button
                onClick={handleSignOut}
                className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-foreground hover:text-background transition"
              >
                Sign Out
              </button>
          </div>
          
        </div>

        <h2 className="text-xl font-bold mb-4">Your WIST.</h2>

        {items.length > 0 ? (
          items.map((item) => (
            <BucketListCard
                key={item.id}
                item={item}
                user = {user}
                onEdit={openEditModal}
                onDelete={(item) => setConfirmDeleteItem(item)}
          />))
            ) : (
              <p className="text-muted-foreground italic">No items yet. Start by adding one!</p>
            )}
          </div>

      <BucketListFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingItem={selectedItem}
      />

      <DeleteConfirmModal
        isOpen={!!confirmDeleteItem}
        onClose={() => setConfirmDeleteItem(null)}
        onConfirm={handleDeleteConfirmed}
        itemName={confirmDeleteItem?.name || ''}
      />
    </div>
  );
}
