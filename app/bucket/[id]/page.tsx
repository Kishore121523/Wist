'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBucketItemDetails, setBucketItemDetails } from '@/firebase/firestore/details';
import { getDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';
import { BucketItem } from '@/types/bucket';
import { BucketItemDetails } from '@/types/details';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function BucketDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState<BucketItem | null>(null);
  const [details, setDetails] = useState<BucketItemDetails>({
    planningNotes: '',
    expectedStartDate: undefined,
    expectedEndDate: undefined,
  });

  useEffect(() => {
    if (!user || !id) return;

    const fetchData = async () => {
      const docRef = doc(db, 'users', user.uid, 'privateBucketLists', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() } as BucketItem);
      }

      const detail = await getBucketItemDetails(user.uid, id as string);
      if (detail) {
        setDetails({
          ...detail,
          expectedStartDate:
            detail.expectedStartDate instanceof Timestamp
              ? detail.expectedStartDate.toDate()
              : detail.expectedStartDate,
          expectedEndDate:
            detail.expectedEndDate instanceof Timestamp
              ? detail.expectedEndDate.toDate()
              : detail.expectedEndDate,
        });
      }
    };

    fetchData();
  }, [user, id]);

  const handleSave = async () => {
    if (!user || !id) return;
    await setBucketItemDetails(user.uid, id as string, {
      ...details,
      updatedAt: new Date(),
    });
  };

  if (!item) return <p className="p-10 text-muted-foreground">Loading...</p>;

  return (
    <div className="min-h-screen px-[10rem] py-24 bg-background text-foreground">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-muted-foreground hover:text-foreground transition"
      >
        ← Go back
      </button>

      <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
      <p className="text-muted-foreground mb-6">{item.description}</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-1">Expected Start Date</label>
          <Input
            type="date"
            value={
              details.expectedStartDate instanceof Date
                ? details.expectedStartDate.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setDetails({ ...details, expectedStartDate: new Date(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Expected End Date</label>
          <Input
            type="date"
            value={
              details.expectedEndDate instanceof Date
                ? details.expectedEndDate.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setDetails({ ...details, expectedEndDate: new Date(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Planning Notes</label>
          <Textarea
            rows={5}
            value={details.planningNotes || ''}
            onChange={(e) => setDetails({ ...details, planningNotes: e.target.value })}
            placeholder="Start planning..."
          />
        </div>

        <Button onClick={handleSave}>Save Planning</Button>
      </div>
    </div>
  );
}
