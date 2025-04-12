'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { btnWhiteBg } from '@/lib/constants';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  cancelLabel?: string;
  sourcePage?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  cancelLabel = 'Close',
  sourcePage,
}: AlertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'bg-card rounded-[6px] text-card-foreground [&>button]:hidden',
          sourcePage === 'bucketListFormModal' ? 'w-[28rem]' : 'min-w-[20rem] max-w-full'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-[-10px]">{message}</p>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className={btnWhiteBg}
          >
            {cancelLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
