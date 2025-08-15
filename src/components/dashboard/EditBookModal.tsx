import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Book } from '@/types';
import { sampleTeamMembers } from '@/data/sampleData';
import { toast } from 'sonner';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBook: (book: Book) => void;
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

  // Populate form when book changes
  useEffect(() => {
    if (book) {
      form.reset({
        title: book.title,
        author: book.author || '',
        pic: book.pic,
        publisher: book.publisher,
        deadline: book.deadline,
        status: book.status,
        notes: '',
        tasks: book.tasks.map(task => ({
          name: task.name,
          pic: task.pic,
          deadline: task.deadline,
          notes: task.notes,
          status: task.status
        }))
      });
    }
  }, [book, form]);

  const onSubmit = (data: BookFormData) => {
    if (!book) return;

    const completedTasks = data.tasks.filter(task => task.status === 'Done').length;
    const progress = Math.round((completedTasks / data.tasks.length) * 100);
    
    const updatedBook: Book = {
      ...book,
      title: data.title,
      author: data.author,
      pic: data.pic,
      publisher: data.publisher,
      progress: progress,
      completedTasks: completedTasks,
      totalTasks: data.tasks.length,
      status: data.status,
      deadline: data.deadline,
      daysLeft: calculateDaysLeft(data.deadline),
      tasks: data.tasks.map((task, index) => ({
        ...book.tasks[index],
        name: task.name,
        pic: task.pic,
        deadline: task.deadline,
        notes: task.notes,
        status: task.status,
        daysLeft: calculateDaysLeft(task.deadline)
      }))
    };

    onUpdateBook(updatedBook);
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
                        {sampleTeamMembers.map((member) => (
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
              <FormLabel className="text-base font-semibold">Daftar Tugas</FormLabel>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Tugas</TableHead>
                      <TableHead>PIC</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">
                          {field.name}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={form.watch(`tasks.${index}.pic`)}
                            onValueChange={(value) => {
                              update(index, { ...field, pic: value });
                            }}
                          >
                            <SelectTrigger className="bg-background border-0 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background border z-50">
                              {sampleTeamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.name}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={form.watch(`tasks.${index}.deadline`)}
                            onChange={(e) => {
                              update(index, { ...field, deadline: e.target.value });
                            }}
                            className="border-0 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={form.watch(`tasks.${index}.status`)}
                            onValueChange={(value) => {
                              update(index, { ...field, status: value as 'Not Started' | 'In Progress' | 'Done' });
                            }}
                          >
                            <SelectTrigger className="bg-background border-0 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background border z-50">
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Catatan..."
                            value={form.watch(`tasks.${index}.notes`)}
                            onChange={(e) => {
                              update(index, { ...field, notes: e.target.value });
                            }}
                            className="border-0 h-8"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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