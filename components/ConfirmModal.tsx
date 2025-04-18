'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { btnRedBg, btnWhiteBg } from '@/lib/constants';

interface ConfirmationModalProps {
  sourcePage?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  sourcePage,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
              'bg-card rounded-[6px] text-card-foreground [&>button]:hidden',
              sourcePage === 'bucketListFormModal' ? 'w-[28rem]' : 'min-w-[20rem] max-w-full'
            )}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-left font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs sm:text-sm text-muted-foreground mt-[-10px]">
          {message}
        </p>

        <div className="flex flex-row justify-end gap-3 sm:gap-4 mt-2">
          <Button
            onClick={onClose}
            className={btnWhiteBg}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={btnRedBg}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
