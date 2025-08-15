import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Book } from '@/types';

interface DeleteBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  book: Book | null;
}

export function DeleteBookDialog({ isOpen, onClose, onConfirm, book }: DeleteBookDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Buku</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus buku "{book?.title}"? 
            Tindakan ini tidak dapat dibatalkan dan semua data terkait buku akan hilang.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus Buku
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}