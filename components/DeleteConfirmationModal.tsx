'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-[6px] shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-1">Delete “{itemName}”?</h2>
        <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-sm border border-foreground text-foregroun cursor-pointer px-4 py-2 rounded-[6px] text-[12px]">Cancel</button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-2 text-[12px] rounded-[6px] bg-foreground text-background hover:border-gray-100 transition duration-200 ease-in-out cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
