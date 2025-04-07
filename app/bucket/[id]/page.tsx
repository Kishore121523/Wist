'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBucketItemDetails, setBucketItemDetails } from '@/firebase/firestore/details';
import { getDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/context/AuthContext';

import { BucketItem } from '@/types/bucket';
import { BucketItemDetails } from '@/types/details';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

import BucketListFormModal from '@/components/BucketListFormModal';
import PlanningEditor from '@/components/PlanningEditor';
import Loader from '@/components/Loader';

import DateInputsWithCountdown from '@/components/DateInputsWithCountdown';

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

  const [editModalOpen, setEditModalOpen] = useState(false);

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
      setDetails({
        ...detail,
        expectedStartDate: detail.expectedStartDate instanceof Timestamp ? detail.expectedStartDate.toDate() : detail.expectedStartDate,
        expectedEndDate: detail.expectedEndDate instanceof Timestamp ? detail.expectedEndDate.toDate() : detail.expectedEndDate,
      });
    }
  };

  useEffect(() => {
    fetchItem();
    fetchDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const handleSave = async () => {
    if (!user || !id) return;
    await setBucketItemDetails(user.uid, id as string, {
      ...details,
      updatedAt: new Date(),
    });
  };

  if (!item) return <Loader />;

  return (
    <div className="min-h-screen px-[10rem] py-24 bg-background text-foreground">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={() => router.back()}
          className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-foreground hover:text-background transition"
        >
          Go back
        </Button>

        <Button
          className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-foreground hover:text-background transition"
          onClick={() => setEditModalOpen(true)}
        >
          <Pencil className='mx-[-2px] h-[2px]' />Edit
        </Button>
      </div>

      <div className="border border-border rounded-[8px] p-6 mb-8 bg-card-dark shadow-sm transition">
        <h1 className="text-3xl font-bold text-background">{item.name}</h1>
        <p className="text-background mb-3">{item.description}</p>

        <div className="flex flex-wrap gap-2 text-background">
          <Badge className='border border-border rounded-[6px]'>{item.category}</Badge>
          <Badge className='border border-border rounded-[6px]'>{item.priority} Priority</Badge>
        </div>
      </div>

      {/* Date inputs */}
      <DateInputsWithCountdown
          startDate={details.expectedStartDate}
          endDate={details.expectedEndDate}
          onChangeStart={(date) => setDetails({ ...details, expectedStartDate: date })}
          onChangeEnd={(date) => setDetails({ ...details, expectedEndDate: date })}
      />

      {/* Rich text editor */}
      <div className="mb-6">
        <label className="block text-sm mb-2">Planning Notes</label>
        <PlanningEditor
          content={details.planningNotes || ''}
          onChange={(value) => setDetails({ ...details, planningNotes: value })}
        />
      </div>

      <Button
        onClick={handleSave}
        className="bg-foreground text-background px-4 py-2 rounded-[6px] text-[12px] font-medium cursor-pointer hover:bg-foreground"
      >
        Save Planning
      </Button>

      {/* Edit Modal */}
      {item && (
        <BucketListFormModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            fetchItem(); //refresh item after closing modal
          }}
          existingItem={item}
        />
      )}
    </div>
  );
}
