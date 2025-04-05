'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { BucketItem } from '@/types/bucket';
import { listenToPrivateBucketLists } from '@/firebase/firestore/private';
import BucketListFormModal from '@/components/BucketListFormModal';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BucketItem | undefined>();

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Hello, {user?.displayName || user?.email}</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      <button
        onClick={openNewItemModal}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
      Add Bucket List Item
      </button>

      <h2 className="text-2xl font-semibold mb-4">Your Bucket List</h2>
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="p-4 border rounded mb-4 cursor-pointer">
            <h3
              onClick={() => openEditModal(item)}
              className="text-lg font-bold hover:text-blue-600"
            >
              {item.name}
            </h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No items yet. Start by adding one!</p>
      )}

      <BucketListFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingItem={selectedItem}
      />
    </div>
  );
}
