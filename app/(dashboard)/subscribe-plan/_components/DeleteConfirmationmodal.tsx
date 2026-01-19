'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

export default function DeleteConfirmationModal({
  planName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  planName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}) {
  return (
    <AlertDialog open onOpenChange={onCancel}>
      <AlertDialogContent className="bg-[#0F3D61] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Delete {planName}?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex justify-end gap-3">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
