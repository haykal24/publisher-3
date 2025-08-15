import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, User, Building2, Clock, Edit, Trash2, Plus } from 'lucide-react';
import { Book, Task } from '@/types';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { tasksService } from '@/services/supabaseService';
import { toast } from 'sonner';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEditTask?: (taskId: string, updatedTask: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function BookDetailModal({ book, isOpen, onClose, onEditTask, onDeleteTask }: BookDetailModalProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<Partial<Task>>({});
  const [bookTasks, setBookTasks] = useState<Task[]>([]);

  // Initialize tasks when book or modal opens
  useEffect(() => {
    if (book && isOpen) {
      // Use existing book tasks or create default task list
      const tasks = book.tasks && book.tasks.length > 0 ? book.tasks : createDefaultTasks(book);
      setBookTasks(tasks);
    }
  }, [book, isOpen]);

  const calculateDaysLeft = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const createDefaultTasks = (book: Book): Task[] => {
    // Complete production task list as specified
    const defaultTaskNames = [
      'Cover Design',
      'Pengantar & Endors',
      'Editing Naskah', 
      'Draf PK & Peta Buku',
      'Layout',
      'Desain Peta Buku',
      'Print & Proofread Awal',
      'QC Isi & ACC Kover Final',
      'Finishing Produksi',
      'SPH',
      'PK Final',
      'Cetak Awal Dummy',
      'Proofread Akhir',
      'Input Akhir',
      'Cetak Dummy Digital Printing (opsional)',
      'Naik Cetak',
      'Turun Cetak'
    ];

    return defaultTaskNames.map((taskName, index) => ({
      id: `${book.id}-task-${index}`,
      name: taskName,
      pic: book.pic,
      deadline: book.deadline,
      daysLeft: calculateDaysLeft(book.deadline),
      notes: 'Catatan...',
      status: 'Not Started' as const
    }));
  };

  if (!book) return null;

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

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-error';
    if (daysLeft <= 7) return 'text-warning';
    return 'text-success';
  };


  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditingTaskData({
      name: task.name,
      pic: task.pic,
      deadline: task.deadline,
      status: task.status,
      notes: task.notes
    });
  };

  const handleSaveTask = (taskId: string) => {
    if (onEditTask && editingTaskData.deadline) {
      const updatedTask = {
        ...editingTaskData,
        daysLeft: calculateDaysLeft(editingTaskData.deadline)
      };
      onEditTask(taskId, updatedTask);
    }
    setEditingTask(null);
    setEditingTaskData({});
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditingTaskData({});
  };

  const updateTaskField = (field: keyof Task, value: string) => {
    setEditingTaskData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Book Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">PIC: {book.pic}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <Badge variant="outline" className={cn("text-xs", getPublisherColor(book.publisher))}>
                  {book.publisher}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Deadline: {new Date(book.deadline).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-medium">{book.progress}%</span>
                </div>
                <Progress value={book.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {book.completedTasks}/{book.totalTasks} tugas selesai
                </span>
                <Badge className={cn("text-xs", getStatusColor(book.status))}>
                  {book.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Daftar Tugas Produksi</h3>
            <div className="border rounded-lg overflow-x-auto">
              <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Tugas</TableHead>
                    <TableHead>PIC</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {editingTask === task.id ? (
                          <Input
                            value={editingTaskData.name || ''}
                            onChange={(e) => updateTaskField('name', e.target.value)}
                            className="min-w-[150px]"
                          />
                        ) : (
                          task.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask === task.id ? (
                          <Input
                            value={editingTaskData.pic || ''}
                            onChange={(e) => updateTaskField('pic', e.target.value)}
                            className="min-w-[100px]"
                          />
                        ) : (
                          task.pic
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask === task.id ? (
                          <Input
                            type="date"
                            value={editingTaskData.deadline || ''}
                            onChange={(e) => updateTaskField('deadline', e.target.value)}
                            className="min-w-[150px]"
                          />
                        ) : (
                          new Date(task.deadline).toLocaleDateString('id-ID')
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-sm", getDaysLeftColor(task.daysLeft))}>
                          {task.daysLeft > 0 ? `${task.daysLeft} hari` : 
                           task.daysLeft === 0 ? 'Hari ini' : 
                           `Terlambat ${Math.abs(task.daysLeft)} hari`}
                        </span>
                      </TableCell>
                      <TableCell>
                        {editingTask === task.id ? (
                          <Textarea
                            value={editingTaskData.notes || ''}
                            onChange={(e) => updateTaskField('notes', e.target.value)}
                            className="min-h-[60px] min-w-[150px]"
                            placeholder="Tambahkan catatan..."
                          />
                        ) : (
                          <span className="text-sm">{task.notes || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask === task.id ? (
                          <Select 
                            value={editingTaskData.status || ''} 
                            onValueChange={(value) => updateTaskField('status', value)}
                          >
                            <SelectTrigger className="min-w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={cn("text-xs", getStatusColor(task.status))}>
                            {task.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTask === task.id ? (
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveTask(task.id)}
                              className="h-8 px-3"
                            >
                              Simpan
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancelEdit}
                              className="h-8 px-3"
                            >
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTask(task)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {onDeleteTask && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDeleteTask(task.id)}
                                className="h-8 w-8 p-0 text-error hover:bg-error/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}