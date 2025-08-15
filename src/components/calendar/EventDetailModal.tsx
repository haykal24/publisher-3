import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/types';
import { Calendar, Clock, User, Book } from 'lucide-react';
import { sampleBooks } from '@/data/sampleData';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

export function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  if (!event) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'near-deadline':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in-progress':
        return 'Sedang Berlangsung';
      case 'near-deadline':
        return 'Mendekati Deadline';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detail Event
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <Badge variant={getStatusVariant(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(event.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>PIC: {(() => {
                const book = sampleBooks.find(b => b.id === event.bookId);
                if (event.id.startsWith('task-')) {
                  const taskId = event.id.replace('task-', '');
                  const task = book?.tasks.find(t => t.id === taskId);
                  return task?.pic || 'Tidak diketahui';
                }
                return book?.pic || 'Tidak diketahui';
              })()}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Penerbit: {event.type === 'deadline' ? 'Deadline' : 'Milestone'}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}