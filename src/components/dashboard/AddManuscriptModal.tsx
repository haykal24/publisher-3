import React, { useState } from 'react';
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
  status: 'Baru Masuk' | 'Review' | 'Diterima' | 'Ditolak' | 'Terbit';
}

interface AddManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManuscript: (manuscript: Manuscript) => void;
}

export function AddManuscriptModal({ isOpen, onClose, onAddManuscript }: AddManuscriptModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dateReceived: null as Date | null,
    genre: '',
    status: 'Baru Masuk' as Manuscript['status']
  });

  const statusOptions: Manuscript['status'][] = [
    'Baru Masuk',
    'Review',
    'Diterima',
    'Ditolak',
    'Terbit'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.dateReceived || !formData.genre) {
      return;
    }

    const newManuscript: Manuscript = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      dateReceived: formData.dateReceived.toISOString(),
      genre: formData.genre,
      status: formData.status
    };

    onAddManuscript(newManuscript);
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      dateReceived: null,
      genre: '',
      status: 'Baru Masuk'
    });
    
    onClose();
  };

  const isFormValid = formData.title && formData.author && formData.dateReceived && formData.genre;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Naskah Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul naskah"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Penulis *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Masukkan nama penulis"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Masuk *</Label>
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
                    format(formData.dateReceived, "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateReceived || undefined}
                  onSelect={(date) => setFormData(prev => ({ ...prev, dateReceived: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="Masukkan genre naskah"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Manuscript['status']) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
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
              Tambah Naskah
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}