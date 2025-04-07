'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card rounded-[6px] text-card-foreground min-w-[20rem] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete “{itemName}”?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-[-10px]">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-foreground hover:text-background transition"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
