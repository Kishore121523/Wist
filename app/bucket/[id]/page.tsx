'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { BucketItem } from '@/types/bucket';
import BucketListFormModal from '@/components/BucketListFormModal';
import Loader from '@/components/Loader';

export default function BucketDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [item, setItem] = useState<BucketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!user) {
        router.push('/');
        return;
      }

      const docRef = doc(db, 'users', user.uid, 'privateBucketLists', params.id as string);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setItem({ ...(snapshot.data() as BucketItem), id: snapshot.id });
      } else {
        setItem(null);
      }

      setLoading(false);
    };

    fetchItem();
  }, [user, params.id, router]);

  if (loading) return <Loader />;
  if (!item) return <p className="p-10 text-muted-foreground">Bucket item not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-foreground">
      <div className="flex items-center justify-between mb-[4rem]">
        <button
          onClick={() => router.back()}
          className="bg-foreground text-background px-4 py-2 rounded-[6px] text-[12px] font-medium cursor-pointer border border-foreground hover:border-gray-100 transition duration-200 ease-in-out"
        >
          ← Back
        </button>

        <button
          onClick={() => setIsEditing(true)}
          className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-foreground hover:text-background transition"
        >
          Edit
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <p className="text-muted-foreground mb-6">{item.description}</p>

      <div className="space-y-3 text-sm">
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Priority:</strong> {item.priority}</p>
        <p><strong>Planning Notes:</strong> {item.planningNote}</p>
        <p><strong>Status:</strong> {item.completed ? '✅ Completed' : '❌ Not yet'}</p>
      </div>

      {/* Modal for editing */}
      <BucketListFormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        existingItem={item}
      />
    </div>
  );
}
