import { useState } from 'react';
import { Search, Filter, Target, BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KPICard } from '@/components/dashboard/KPICard';
import { BookCard } from '@/components/dashboard/BookCard';
import { BookDetailModal } from '@/components/dashboard/BookDetailModal';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { DeadlineList } from '@/components/dashboard/DeadlineList';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';
import { useAppData } from '@/contexts/AppDataContext';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { Book } from '@/types';

export default function Dashboard() {
  const { books, kpiData, yearlyTargets, monthlyTargets, currentYear } = useAppData();
  const analytics = useRealTimeAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [publisherFilter, setPublisherFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    const matchesPublisher = publisherFilter === 'all' || book.publisher === publisherFilter;
    
    // Filter by month and year based on deadline
    const bookDeadline = new Date(book.deadline);
    const bookMonth = String(bookDeadline.getMonth() + 1).padStart(2, '0');
    const bookYear = String(bookDeadline.getFullYear());
    
    const matchesMonth = monthFilter === 'all' || bookMonth === monthFilter;
    const matchesYear = yearFilter === 'all' || bookYear === yearFilter;
    
    return matchesSearch && matchesStatus && matchesPublisher && matchesMonth && matchesYear;
  });

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Penerbitan Buku</h1>
          <p className="text-muted-foreground">Selamat datang, Andi Setiawan!</p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari buku, penulis, atau PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Not Started">Belum Mulai</SelectItem>
                <SelectItem value="In Progress">Dalam Proses</SelectItem>
                <SelectItem value="Done">Selesai</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={publisherFilter} onValueChange={setPublisherFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Penerbit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Penerbit</SelectItem>
                <SelectItem value="Renebook">Renebook</SelectItem>
                <SelectItem value="Turos Pustaka">Turos Pustaka</SelectItem>
                <SelectItem value="Reneluv">Reneluv</SelectItem>
                <SelectItem value="Renekids">Renekids</SelectItem>
                <SelectItem value="Milestone">Milestone</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={showAdvancedFilters ? "bg-primary text-primary-foreground" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
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
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Target Tahun Ini"
          value={yearlyTargets.find(t => t.year === currentYear)?.target || 0}
          subtitle="judul buku"
          variant="default"
          icon={<Target className="w-8 h-8" />}
        />
        <KPICard
          title="Target Bulan Ini"
          value={monthlyTargets[currentYear]?.[new Date().toLocaleDateString('id-ID', { month: 'short' })] || 0}
          subtitle="judul buku"
          variant="accent"
          icon={<BookOpen className="w-8 h-8" />}
        />
        <KPICard
          title="Sedang Dikerjakan"
          value={analytics.booksInProgress}
          subtitle="buku aktif"
          variant="default"
          icon={<Clock className="w-8 h-8" />}
        />
        <KPICard
          title="Selesai"
          value={analytics.completedBooks}
          subtitle="buku terbit"
          variant="success"
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <KPICard
          title="Mendekati Deadline"
          value={analytics.booksNearDeadline}
          subtitle="< 7 hari"
          variant="warning"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatusChart />
        <ProgressChart />
        <DeadlineList books={books} />
      </div>

      {/* Books Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Daftar Buku Terkini</h2>
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredBooks.length} dari {books.length} buku
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
        
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada buku ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>

      {/* Debug Panel - Temporary for testing */}
      <UserDebugPanel />

      <BookDetailModal
        book={selectedBook}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}