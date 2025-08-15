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
import { TeamMember } from '@/types';

interface DeleteTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  member: TeamMember | null;
}

export function DeleteTeamMemberDialog({ isOpen, onClose, onConfirm, member }: DeleteTeamMemberDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Anggota Tim</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus <strong>{member?.name}</strong> dari tim? 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}