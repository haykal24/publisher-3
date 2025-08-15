import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, KPIData } from '@/types';
import { useBooks, useTargets } from '@/hooks/useSupabaseData';

interface AppDataContextType {
  books: Book[];
  setBooks: (books: Book[] | ((prev: Book[]) => Book[])) => void;
  kpiData: KPIData;
  yearlyTargets: Array<{ year: number; target: number }>;
  setYearlyTargets: (targets: Array<{ year: number; target: number }>) => void;
  monthlyTargets: { [year: number]: { [month: string]: number } };
  setMonthlyTargets: (targets: { [year: number]: { [month: string]: number } }) => void;
  currentYear: number;
  loading: boolean;
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { books, loading, addBook, updateBook, deleteBook } = useBooks();
  const { targets } = useTargets();
  
  // Transform targets data to match existing interface
  const [yearlyTargets, setYearlyTargets] = useState<Array<{ year: number; target: number }>>([]);
  
  const [monthlyTargets, setMonthlyTargets] = useState<{ [year: number]: { [month: string]: number } }>({});

  // Update local state when targets data is loaded from Supabase
  useEffect(() => {
    if (targets.length > 0) {
      const newYearlyTargets = targets.map(target => ({
        year: target.year,
        target: target.annualTarget
      }));
      setYearlyTargets(newYearlyTargets);

      const newMonthlyTargets: { [year: number]: { [month: string]: number } } = {};
      targets.forEach(target => {
        newMonthlyTargets[target.year] = target.monthlyTargets;
      });
      setMonthlyTargets(newMonthlyTargets);
    }
  }, [targets]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long' });

  // Calculate KPI data based on current books and targets
  const calculateKPIData = (): KPIData => {
    const currentYearTarget = yearlyTargets.find(t => t.year === currentYear)?.target || 0;
    
    // Find current month target from monthly targets using Indonesian month names
    const monthMapping: Record<string, string> = {
      'Januari': 'Januari', 'Februari': 'Februari', 'Maret': 'Maret', 'April': 'April',
      'Mei': 'Mei', 'Juni': 'Juni', 'Juli': 'Juli', 'Agustus': 'Agustus',
      'September': 'September', 'Oktober': 'Oktober', 'November': 'November', 'Desember': 'Desember'
    };
    
    const currentMonthTarget = monthlyTargets[currentYear]?.[monthMapping[currentMonth]] || 0;

    // Books in progress - count all books with status "In Progress"
    const inProgress = books.filter(book => book.status === 'In Progress').length;

    // Completed books - count all books with status "Done"
    const completed = books.filter(book => book.status === 'Done').length;

    // Books near deadline (within 7 days) - calculate based on deadline field
    const today = new Date();
    const nearDeadline = books.filter(book => {
      if (book.status === 'Done') return false;
      
      const deadline = new Date(book.deadline);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length;

    return {
      yearTarget: currentYearTarget,
      monthTarget: currentMonthTarget,
      inProgress,
      completed,
      nearDeadline
    };
  };

  const [kpiData, setKpiData] = useState<KPIData>({
    yearTarget: 0,
    monthTarget: 0,
    inProgress: 0,
    completed: 0,
    nearDeadline: 0
  });

  // Recalculate KPI when books, targets, or dates change
  useEffect(() => {
    setKpiData(calculateKPIData());
  }, [books, yearlyTargets, monthlyTargets]);

  const setBooks = (books: Book[] | ((prev: Book[]) => Book[])) => {
    // This is kept for compatibility but actual data management is handled by useBooks hook
    console.warn('setBooks called - data is now managed by Supabase');
  };

  const value = {
    books,
    setBooks,
    kpiData,
    yearlyTargets,
    setYearlyTargets,
    monthlyTargets,
    setMonthlyTargets,
    currentYear,
    loading,
    addBook,
    updateBook,
    deleteBook
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}