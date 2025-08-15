import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Book, Task } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTeamMembers } from '@/hooks/useSupabaseData';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  book: Book | null;
}

interface BookFormData {
  title: string;
  author: string;
  pic: string;
  publisher: 'Renebook' | 'Turos Pustaka' | 'Reneluv' | 'Renekids' | 'Milestone';
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  notes: string;
  tasks: Array<{
    name: string;
    pic: string;
    deadline: string;
    notes: string;
    status: 'Not Started' | 'In Progress' | 'Done';
  }>;
}

export function EditBookModal({ isOpen, onClose, onUpdateBook, book }: EditBookModalProps) {
  const { teamMembers } = useTeamMembers();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<Partial<Task>>({});
  
  const form = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      pic: '',
      publisher: 'Renebook',
      deadline: '',
      status: 'Not Started',
      notes: '',
      tasks: []
    }
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "tasks"
  });

  // Complete list of production tasks
  const getAllProductionTasks = () => [
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

  // Populate form when book changes
  useEffect(() => {
    if (book) {
      const allTaskNames = getAllProductionTasks();
      
      // Create complete task list - use existing tasks or create defaults
      const completeTasks = allTaskNames.map((taskName, index) => {
        const existingTask = book.tasks.find(task => task.name === taskName);
        
        return {
          name: taskName,
          pic: existingTask?.pic || book.pic,
          deadline: existingTask?.deadline || book.deadline,
          notes: existingTask?.notes || 'Catatan...',
          status: existingTask?.status || 'Not Started' as const
        };
      });

      form.reset({
        title: book.title,
        author: book.author || '',
        pic: book.pic,
        publisher: book.publisher,
        deadline: book.deadline,
        status: book.status,
        notes: '',
        tasks: completeTasks
      });
    }
  }, [book, form]);

  const onSubmit = async (data: BookFormData) => {
    if (!book) return;

    const completedTasks = data.tasks.filter(task => task.status === 'Done').length;
    const progress = Math.round((completedTasks / data.tasks.length) * 100);
    
    const updates = {
      title: data.title,
      author: data.author,
      pic: data.pic,
      publisher: data.publisher,
      progress: progress,
      completedTasks: completedTasks,
      totalTasks: data.tasks.length,
      status: data.status,
      deadline: data.deadline,
      daysLeft: calculateDaysLeft(data.deadline)
    };

    await onUpdateBook(book.id, updates);
    toast.success('Buku berhasil diupdate!');
    onClose();
  };

  const calculateDaysLeft = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-error';
    if (daysLeft <= 7) return 'text-warning';
    return 'text-success';
  };

  const handleEditTask = (task: any, index: number) => {
    setEditingTask(`${index}`);
    setEditingTaskData({
      name: task.name,
      pic: task.pic,
      deadline: task.deadline,
      status: task.status,
      notes: task.notes
    });
  };

  const handleSaveTask = (index: number) => {
    if (editingTaskData.deadline && editingTaskData.name && editingTaskData.pic && editingTaskData.status) {
      const updatedTask = {
        name: editingTaskData.name,
        pic: editingTaskData.pic,
        deadline: editingTaskData.deadline,
        notes: editingTaskData.notes || '',
        status: editingTaskData.status
      };
      update(index, updatedTask);
    }
    setEditingTask(null);
    setEditingTaskData({});
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditingTaskData({});
  };

  const updateTaskField = (field: keyof Task, value: string) => {
    setEditingTaskData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteTask = (index: number) => {
    // Reset task to default values instead of removing
    const defaultTask = {
      name: fields[index].name,
      pic: book?.pic || '',
      deadline: book?.deadline || '',
      notes: 'Catatan...',
      status: 'Not Started' as const
    };
    update(index, defaultTask);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Buku</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: 'Judul buku wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Buku</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul buku" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                rules={{ required: 'Penulis wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penulis</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama penulis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pic"
                rules={{ required: 'PIC wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIC (Person in Charge)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Pilih PIC" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border z-50">
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publisher"
                rules={{ required: 'Penerbit wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penerbit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Pilih penerbit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="Renebook">Renebook</SelectItem>
                        <SelectItem value="Turos Pustaka">Turos Pustaka</SelectItem>
                        <SelectItem value="Reneluv">Reneluv</SelectItem>
                        <SelectItem value="Renekids">Renekids</SelectItem>
                        <SelectItem value="Milestone">Milestone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                rules={{ required: 'Deadline wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                rules={{ required: 'Status wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Masukkan catatan tambahan..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tasks Table */}
            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">Daftar Tugas Produksi</FormLabel>
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
                    {fields.map((field, index) => {
                      const task = form.watch(`tasks.${index}`);
                      const daysLeft = task?.deadline ? calculateDaysLeft(task.deadline) : 0;
                      
                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">
                            {editingTask === `${index}` ? (
                              <Input 
                                value={editingTaskData.name || ''} 
                                onChange={(e) => updateTaskField('name', e.target.value)}
                                className="min-w-[150px]" 
                              />
                            ) : (
                              field.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingTask === `${index}` ? (
                              <Select 
                                value={editingTaskData.pic || ''} 
                                onValueChange={(value) => updateTaskField('pic', value)}
                              >
                                <SelectTrigger className="min-w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {teamMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.name}>
                                      {member.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              task?.pic || ''
                            )}
                          </TableCell>
                          <TableCell>
                            {editingTask === `${index}` ? (
                              <Input 
                                type="date" 
                                value={editingTaskData.deadline || ''} 
                                onChange={(e) => updateTaskField('deadline', e.target.value)}
                                className="min-w-[150px]" 
                              />
                            ) : (
                              task?.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : ''
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={cn("text-sm", getDaysLeftColor(daysLeft))}>
                              {daysLeft > 0 ? `${daysLeft} hari` : daysLeft === 0 ? 'Hari ini' : `Terlambat ${Math.abs(daysLeft)} hari`}
                            </span>
                          </TableCell>
                          <TableCell>
                            {editingTask === `${index}` ? (
                              <Textarea 
                                value={editingTaskData.notes || ''} 
                                onChange={(e) => updateTaskField('notes', e.target.value)}
                                className="min-h-[60px] min-w-[150px]" 
                                placeholder="Tambahkan catatan..." 
                              />
                            ) : (
                              <span className="text-sm">{task?.notes || '-'}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingTask === `${index}` ? (
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
                              <Badge className={cn("text-xs", getStatusColor(task?.status || 'Not Started'))}>
                                {task?.status || 'Not Started'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingTask === `${index}` ? (
                              <div className="flex gap-1">
                                <Button size="sm" onClick={() => handleSaveTask(index)} className="h-8 px-3">
                                  Simpan
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-3">
                                  Batal
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditTask(task, index)} 
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteTask(index)} 
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                Update Buku
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}