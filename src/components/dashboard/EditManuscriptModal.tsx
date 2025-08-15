import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Manuscript {
  id: string;
  title: string;
  author: string;
  dateReceived: string;
  genre: string;
  status: string;
}

interface EditManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  manuscript: Manuscript | null;
  onUpdateManuscript: (id: string, updates: Partial<Manuscript>) => Promise<void>;
}

export function EditManuscriptModal({ isOpen, onClose, manuscript, onUpdateManuscript }: EditManuscriptModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dateReceived: '',
    genre: '',
    status: ''
  });

  useEffect(() => {
    if (manuscript) {
      setFormData({
        title: manuscript.title,
        author: manuscript.author,
        dateReceived: manuscript.dateReceived,
        genre: manuscript.genre,
        status: manuscript.status
      });
    }
  }, [manuscript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manuscript || !formData.title || !formData.author || !formData.dateReceived || !formData.genre || !formData.status) {
      return;
    }

    const updates = {
      title: formData.title,
      author: formData.author,
      dateReceived: formData.dateReceived.split('T')[0], // Ensure date format
      genre: formData.genre,
      status: formData.status
    };

    await onUpdateManuscript(manuscript.id, updates);
  };

  const isFormValid = formData.title && formData.author && formData.dateReceived && formData.genre && formData.status;

  if (!manuscript) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Naskah</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Naskah</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul naskah"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Nama Penulis</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Masukkan nama penulis"
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Masuk</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateReceived && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateReceived ? (
                    format(new Date(formData.dateReceived), "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateReceived ? new Date(formData.dateReceived) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, dateReceived: date.toISOString() }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="Masukkan genre"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baru Masuk">Baru Masuk</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Diterima">Diterima</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
                <SelectItem value="Terbit">Terbit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="bg-gradient-primary shadow-primary"
            >
              Update Naskah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}