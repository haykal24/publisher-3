import { useState } from 'react';
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KPICard } from '@/components/dashboard/KPICard';
import { AddManuscriptModal } from '@/components/dashboard/AddManuscriptModal';
import { EditManuscriptModal } from '@/components/dashboard/EditManuscriptModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { sampleManuscripts } from '@/data/sampleData';
import { cn } from '@/lib/utils';

export default function Manuscripts() {
  const { toast } = useToast();
  const [manuscripts, setManuscripts] = useState(sampleManuscripts);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingManuscript, setEditingManuscript] = useState<any>(null);

  const filteredManuscripts = manuscripts.filter(manuscript => {
    const matchesSearch = 
      manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manuscript.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manuscript.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const manuscriptDate = new Date(manuscript.dateReceived);
    const manuscriptMonth = (manuscriptDate.getMonth() + 1).toString().padStart(2, '0');
    const manuscriptYear = manuscriptDate.getFullYear().toString();
    
    const matchesMonth = monthFilter === 'all' || manuscriptMonth === monthFilter;
    const matchesYear = yearFilter === 'all' || manuscriptYear === yearFilter;
    
    return matchesSearch && matchesMonth && matchesYear;
  });

  const handleAddManuscript = (newManuscript: any) => {
    setManuscripts(prev => [...prev, newManuscript]);
  };

  const handleEditManuscript = (manuscript: any) => {
    setEditingManuscript(manuscript);
    setIsEditModalOpen(true);
  };

  const handleUpdateManuscript = (updatedManuscript: any) => {
    setManuscripts(prev => prev.map(m => m.id === updatedManuscript.id ? updatedManuscript : m));
    setIsEditModalOpen(false);
    setEditingManuscript(null);
  };

  const handleDeleteManuscript = (manuscriptId: string) => {
    setManuscripts(prev => prev.filter(m => m.id !== manuscriptId));
    toast({
      title: "Naskah dihapus",
      description: "Naskah berhasil dihapus dari sistem.",
    });
  };

  // Get unique years from manuscripts for dynamic filter
  const getAvailableYears = () => {
    const years = manuscripts.map(manuscript => {
      const date = new Date(manuscript.dateReceived);
      return date.getFullYear().toString();
    });
    const uniqueYears = [...new Set(years)];
    return uniqueYears.sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending (newest first)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Baru Masuk': 'bg-accent/10 text-accent border-accent/20',
      'Review': 'bg-warning/10 text-warning border-warning/20',
      'Diterima': 'bg-success/10 text-success border-success/20',
      'Ditolak': 'bg-error/10 text-error border-error/20',
      'Terbit': 'bg-primary/10 text-primary border-primary/20'
    };
    return colors[status as keyof typeof colors] || 'bg-muted/10 text-muted-foreground';
  };

  // Calculate KPI data based on filtered manuscripts
  const manuscriptStats = {
    total: filteredManuscripts.length,
    published: filteredManuscripts.filter(m => m.status === 'Terbit').length,
    inProcess: filteredManuscripts.filter(m => ['Review', 'Diterima'].includes(m.status)).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Naskah</h1>
          <p className="text-muted-foreground">Kelola semua naskah yang masuk</p>
        </div>
        <Button 
          className="bg-gradient-primary shadow-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Naskah Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul, penulis, atau genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              <SelectItem value="01">Januari</SelectItem>
              <SelectItem value="02">Februari</SelectItem>
              <SelectItem value="03">Maret</SelectItem>
              <SelectItem value="04">April</SelectItem>
              <SelectItem value="05">Mei</SelectItem>
              <SelectItem value="06">Juni</SelectItem>
              <SelectItem value="07">Juli</SelectItem>
              <SelectItem value="08">Agustus</SelectItem>
              <SelectItem value="09">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Desember</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {getAvailableYears().map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Naskah Masuk"
          value={manuscriptStats.total}
          subtitle="total naskah"
          variant="default"
          icon={<FileText className="w-8 h-8" />}
        />
        <KPICard
          title="Naskah Terbit"
          value={manuscriptStats.published}
          subtitle="sudah diterbitkan"
          variant="success"
          icon={<FileText className="w-8 h-8" />}
        />
        <KPICard
          title="Dalam Proses"
          value={manuscriptStats.inProcess}
          subtitle="review & produksi"
          variant="accent"
          icon={<FileText className="w-8 h-8" />}
        />
      </div>

      {/* Manuscripts Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Daftar Naskah</h2>
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredManuscripts.length} dari {manuscripts.length} naskah
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Judul</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManuscripts.map((manuscript) => (
                <TableRow key={manuscript.id} className="hover:bg-muted/25">
                  <TableCell className="font-medium">{manuscript.title}</TableCell>
                  <TableCell>{manuscript.author}</TableCell>
                  <TableCell>
                    {new Date(manuscript.dateReceived).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50">
                      {manuscript.genre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(manuscript.status))}>
                      {manuscript.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditManuscript(manuscript)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-error hover:bg-error/10">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Naskah</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus naskah "{manuscript.title}"? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteManuscript(manuscript.id)}
                              className="bg-error text-error-foreground hover:bg-error/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredManuscripts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada naskah ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>

      <AddManuscriptModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddManuscript={handleAddManuscript}
      />

      <EditManuscriptModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingManuscript(null);
        }}
        manuscript={editingManuscript}
        onUpdateManuscript={handleUpdateManuscript}
      />
    </div>
  );
}