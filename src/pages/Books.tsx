import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookCard } from '@/components/dashboard/BookCard';
import { BookDetailModal } from '@/components/dashboard/BookDetailModal';
import { AddBookModal } from '@/components/dashboard/AddBookModal';
import { EditBookModal } from '@/components/dashboard/EditBookModal';
import { DeleteBookDialog } from '@/components/dashboard/DeleteBookDialog';
import { useBooks } from '@/hooks/useSupabaseData';
import { Book } from '@/types';
export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    
    // Filter by month and year based on deadline
    const bookDeadline = new Date(book.deadline);
    const bookMonth = String(bookDeadline.getMonth() + 1).padStart(2, '0');
    const bookYear = String(bookDeadline.getFullYear());
    
    const matchesMonth = monthFilter === 'all' || bookMonth === monthFilter;
    const matchesYear = yearFilter === 'all' || bookYear === yearFilter;
    
    return matchesSearch && matchesStatus && matchesMonth && matchesYear;
  });

  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const hasMoreBooks = filteredBooks.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };
  const handleAddBook = () => {
    setIsAddModalOpen(true);
  };
  const handleBookAdded = async (newBook: Omit<Book, 'id' | 'createdAt'>) => {
    await addBook(newBook);
  };
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  const handleBookUpdated = async (id: string, updates: Partial<Book>) => {
    await updateBook(id, updates);
  };
  const handleDeleteBook = (book: Book) => {
    setDeletingBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingBook) {
      await deleteBook(deletingBook.id);
      setIsDeleteDialogOpen(false);
      setDeletingBook(null);
    }
  };
  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };
  return <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Semua Buku</h1>
          <p className="text-muted-foreground">Kelola semua proyek penerbitan buku</p>
        </div>
        <Button onClick={handleAddBook} className="bg-gradient-primary shadow-primary">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Buku
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari judul buku atau PIC..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
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
          
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
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
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          
          
        </div>
      </div>

      {/* Books Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {visibleBooks.length} dari {filteredBooks.length} buku
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleBooks.map(book => <div key={book.id} className="relative group">
              <BookCard book={book} showActions={true} onEdit={handleEditBook} onDelete={handleDeleteBook} onViewDetails={handleViewDetails} />
              
              {/* Action buttons overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                
              </div>
            </div>)}
        </div>

        {/* Load More Button */}
        {hasMoreBooks && (
          <div className="flex justify-center pt-6">
            <Button 
              variant="outline" 
              onClick={handleLoadMore}
              className="px-6"
            >
              Buku Lainnya
            </Button>
          </div>
        )}
      </div>

      <BookDetailModal 
        book={selectedBook} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        onEditTask={async (taskId, updates) => {
          // Handle task update
          console.log('Editing task:', taskId, updates);
        }}
        onDeleteTask={async (taskId) => {
          // Handle task deletion
          console.log('Deleting task:', taskId);
        }}
      />

      <AddBookModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddBook={handleBookAdded} />
      
      <EditBookModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdateBook={handleBookUpdated}
        book={editingBook}
      />

      <DeleteBookDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        book={deletingBook}
      />
    </div>;
}