'use client';

import { useEffect, useState } from 'react';
import { BucketItem } from '@/types/bucket';
import { useAuth } from '@/context/AuthContext';
import {
  createPrivateBucketList,
  updatePrivateBucketItem,
  deletePrivateBucketItem,
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
    planningNote: '',
    completed: false,
  });

  useEffect(() => {
    if (existingItem) {
      setForm(existingItem);
    } else {
      setForm({
        name: '',
        description: '',
        category: '',
        priority: 'Medium',
        daysToTick: 0,
        planningNote: '',
        completed: false,
      });
    }
  }, [existingItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (isEdit && existingItem?.id) {
      await updatePrivateBucketItem(user.uid, existingItem.id, form);
    } else {
      await createPrivateBucketList(user.uid, form);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!user || !existingItem?.id) return;
    await deletePrivateBucketItem(user.uid, existingItem.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit' : 'Add'} Bucket List Item</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border mb-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border mb-2 rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border mb-2 rounded"
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full p-2 border mb-2 rounded"
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
          className="w-full p-2 border mb-2 rounded"
        />
        <textarea
          name="planningNote"
          value={form.planningNote}
          onChange={handleChange}
          placeholder="Planning Notes"
          className="w-full p-2 border mb-4 rounded"
        />

        <div className="flex justify-between">
          {isEdit && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
          <div className="ml-auto space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
