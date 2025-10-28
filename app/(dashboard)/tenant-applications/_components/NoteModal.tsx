"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface NoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: string;
}

export function NoteModal({ open, onOpenChange, note }: NoteModalProps) {
  const hasNote = note?.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white !rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="flex text-[#0F3D61] text-xl items-center justify-between">
            Request Note
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {hasNote ? (
            <p className="whitespace-pre-wrap text-sm text-[18px] font-normal text-[#343A40]">{note}</p>
          ) : (
            <p className="italic text-[18px] font-normal text-[#343A40]">No data available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}