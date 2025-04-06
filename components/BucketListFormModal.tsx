'use client';

import { useEffect, useState } from 'react';
import { BucketItem } from '@/types/bucket';
import { useAuth } from '@/context/AuthContext';
import {
  createPrivateBucketList,
  updatePrivateBucketItem,
} from '@/firebase/firestore/private';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingItem?: BucketItem;
}

export default function BucketListFormModal({ isOpen, onClose, existingItem }: Props) {
  const { user } = useAuth();
  const isEdit = !!existingItem;

  const [form, setForm] = useState<BucketItem>({
    name: '',
    description: '',
    category: '',
    priority: 'Medium',
    daysToTick: 0,
    completed: false,
  });

  useEffect(() => {
    if (existingItem) {
      setForm(existingItem);
    } else {
      console.log(existingItem)
      setForm({
        name: '',
        description: '',
        category: '',
        priority: 'Medium',
        daysToTick: 0,
        completed: false,
      });
    }
  }, [existingItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (isEdit && existingItem?.id) {
      await updatePrivateBucketItem(user.uid, existingItem.id, form);
    } else {
      await createPrivateBucketList(user.uid, form);
      setForm({
        name: '',
        description: '',
        category: '',
        priority: 'Medium',
        daysToTick: 0,
        completed: false,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-[6px] shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">{isEdit ? `Edit Bucket List Item - ${form.name}` : 'Add Bucket List Item'}</h2>

        <div className="space-y-4 mb-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border border-border rounded-[6px] bg-background"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border border-border rounded-[6px] bg-background"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 border border-border rounded-[6px] bg-background"
          />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded-[6px] bg-background"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="number"
            name="daysToTick"
            value={form.daysToTick}
            onChange={handleChange}
            placeholder="Days to tick off"
            className="w-full p-2 border border-border rounded-[6px] bg-background"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="ml-auto flex">
            <button
              onClick={onClose}
              className="text-sm border border-foreground text-foregroun cursor-pointer mr-2 px-4 py-2 rounded-[6px] text-[12px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-sm px-4 py-2 text-[12px] rounded-[6px] bg-foreground text-background hover:border-gray-100 transition duration-200 ease-in-out cursor-pointer"
            >
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
