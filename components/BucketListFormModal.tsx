'use client';

import { useEffect, useState } from 'react';
import { BucketItem } from '@/types/bucket';
import { useAuth } from '@/context/AuthContext';
import {
  createPrivateBucketList,
  updatePrivateBucketItem,
} from '@/firebase/firestore/private';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import CategorySelect from './CategorySelect';
import { Textarea } from './ui/textarea';
import ConfirmModal from './ConfirmModal';
import { formInputStyle,
  selectItemInputStyle,
  selectTriggerStyle,
  btnWhiteBg } from '@/lib/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingItem?: BucketItem;
}

const emptyForm: BucketItem = {
  name: '',
  description: '',
  category: '',
  priority: 'Medium',
  priorityValue: 2,
  completed: false,
};

export default function BucketListFormModal({ isOpen, onClose, existingItem }: Props) {
  const { user } = useAuth();
  const isEdit = !!existingItem;

  const [form, setForm] = useState<BucketItem>(emptyForm);
  const [showConfirm, setShowConfirm] = useState(false);
  const [initialForm, setInitialForm] = useState<BucketItem>(emptyForm);

  useEffect(() => {
    const base = existingItem || emptyForm;
    setForm(base);
    setInitialForm(base);
  }, [existingItem]);

  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePriorityChange = (value: 'High' | 'Medium' | 'Low') => {
    setForm({ ...form, priority: value });
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (isEdit && existingItem?.id) {
      await updatePrivateBucketItem(user.uid, existingItem.id, form);
    } else {
      await createPrivateBucketList(user.uid, form);
    }

    // Reset form state after submission
    setForm(emptyForm);
    setInitialForm(emptyForm);
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirm(true);
    } else {
      if (!isEdit) {
        setForm(emptyForm);
        setInitialForm(emptyForm);
      }
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-card rounded-[6px] text-card-foreground max-w-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {isEdit ? 'Edit WIST.' : 'Add WIST.'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className={formInputStyle}
            />
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className={formInputStyle}
            />

            <CategorySelect
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val })}
              selectItemInputStyle={selectItemInputStyle}
              selectTriggerStyle={selectTriggerStyle}
            />

            <Select value={form.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className={selectTriggerStyle}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="w-full border border-border rounded-[6px]">
                <SelectItem className={selectItemInputStyle} value="Low">Low</SelectItem>
                <SelectItem className={selectItemInputStyle} value="Medium">Medium</SelectItem>
                <SelectItem className={selectItemInputStyle} value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={handleClose}
              className={btnWhiteBg}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={btnWhiteBg}
              disabled={!form.name}
            >
              {isEdit ? 'Update' : 'Add'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        sourcePage="bucketListFormModal"
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          if (!isEdit) {
            setForm(emptyForm);
            setInitialForm(emptyForm);
          }
          onClose();
        }}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard Changes"
        cancelLabel="Keep Editing"
      />
    </>
  );
}
