import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, User, Building2, Clock, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Book } from "@/types";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  showActions?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  onViewDetails?: (book: Book) => void;
}

export function BookCard({ book, showActions = false, onEdit, onDelete, onViewDetails }: BookCardProps) {
  // Find "Naik Cetak" task for deadline display
  const naikCetakTask = book.tasks.find(task => task.name === 'Naik Cetak');
  const displayDeadline = naikCetakTask ? naikCetakTask.deadline : book.deadline;
  
  // Calculate deadline status and days based on "Naik Cetak" rules
  const calculateDeadlineInfo = () => {
    const targetDeadline = naikCetakTask ? naikCetakTask.deadline : book.deadline;
    const today = new Date();
    const deadlineDate = new Date(targetDeadline);
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Check if "Naik Cetak" task is Done
    const isNaikCetakDone = naikCetakTask?.status === 'Done';
    
    if (isNaikCetakDone) {
      // If Done and deadline hasn't passed (completed on time)
      if (diffDays >= 0) {
        return { daysLeft: 0, status: 'on-time', message: 'Tepat Waktu' };
      } else {
        // If Done but was completed after deadline (preserve late status)
        return { daysLeft: Math.abs(diffDays), status: 'late', message: `Terlambat ${Math.abs(diffDays)} hari` };
      }
    } else {
      // Task not done yet
      if (diffDays > 0) {
        return { daysLeft: diffDays, status: 'upcoming', message: `${diffDays} hari lagi` };
      } else if (diffDays === 0) {
        return { daysLeft: 0, status: 'today', message: 'Hari ini' };
      } else {
        return { daysLeft: Math.abs(diffDays), status: 'late', message: `Terlambat ${Math.abs(diffDays)} hari` };
      }
    }
  };
  
  const deadlineInfo = calculateDeadlineInfo();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-success text-success-foreground';
      case 'In Progress':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPublisherColor = (publisher: string) => {
    const colors = {
      'Renebook': 'bg-primary/10 text-primary border-primary/20',
      'Turos Pustaka': 'bg-accent/10 text-accent border-accent/20',
      'Reneluv': 'bg-success/10 text-success border-success/20',
      'Renekids': 'bg-warning/10 text-warning border-warning/20',
      'Milestone': 'bg-error/10 text-error border-error/20'
    };
    return colors[publisher as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getDeadlineColor = (status: string) => {
    switch (status) {
      case 'late':
        return 'text-error';
      case 'today':
        return 'text-warning';
      case 'on-time':
        return 'text-success';
      default:
        return 'text-success';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">{book.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{book.author || book.pic}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <Badge variant="outline" className={cn("text-xs", getPublisherColor(book.publisher))}>
                  {book.publisher}
                </Badge>
              </div>
            </div>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit?.(book)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Buku
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(book)}
                  className="text-error focus:text-error"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Buku
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{book.progress}%</span>
          </div>
          <Progress value={book.progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{book.completedTasks}/{book.totalTasks} tugas selesai</span>
            <Badge className={cn("text-xs", getStatusColor(book.status))}>
              {book.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Deadline</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{new Date(displayDeadline).toLocaleDateString('id-ID')}</div>
            <div className={cn("text-xs flex items-center gap-1", getDeadlineColor(deadlineInfo.status))}>
              <Clock className="w-3 h-3" />
              {deadlineInfo.message}
            </div>
          </div>
        </div>

        {onViewDetails && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(book)}
            className="w-full"
          >
            Lihat Detail
          </Button>
        )}
      </CardContent>
    </Card>
  );
}