import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TeamMember } from '@/types';
import { toast } from 'sonner';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: TeamMember) => void;
}

interface TeamMemberFormData {
  name: string;
  email: string;
  role: 'Manajer' | 'Produksi' | 'Renebook' | 'Turos Pustaka' | 'Reneluv' | 'Renekids' | 'Milestone';
  password: string;
}

export function AddTeamMemberModal({ isOpen, onClose, onAddMember }: AddTeamMemberModalProps) {
  const form = useForm<TeamMemberFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'Produksi',
      password: ''
    }
  });

  const onSubmit = (data: TeamMemberFormData) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
      avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };

    onAddMember(newMember);
    toast.success('Anggota tim berhasil ditambahkan!');
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Anggota Tim</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Nama wajib diisi' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format email tidak valid'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              rules={{ required: 'Role wajib dipilih' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Manajer">Manajer</SelectItem>
                      <SelectItem value="Produksi">Produksi</SelectItem>
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
              name="password"
              rules={{ 
                required: 'Password wajib diisi',
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Masukkan password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                Tambah Anggota
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}