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
  const [yearlyTargets, setYearlyTargets] = useState([
    { year: 2024, target: 120 },
    { year: 2025, target: 150 }
  ]);
  
  const [monthlyTargets, setMonthlyTargets] = useState<{ [year: number]: { [month: string]: number } }>({
    2024: {
      'Jan': 10, 'Feb': 10, 'Mar': 10, 'Apr': 10,
      'Mei': 10, 'Jun': 10, 'Jul': 10, 'Agu': 10,
      'Sep': 10, 'Okt': 10, 'Nov': 10, 'Des': 10
    },
    2025: {
      'Jan': 12, 'Feb': 12, 'Mar': 12, 'Apr': 12,
      'Mei': 13, 'Jun': 13, 'Jul': 13, 'Agu': 13,
      'Sep': 13, 'Okt': 13, 'Nov': 13, 'Des': 13
    }
  });

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
  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'short' });

  // Calculate KPI data based on current books and targets
  const calculateKPIData = (): KPIData => {
    const currentYearTarget = yearlyTargets.find(t => t.year === currentYear)?.target || 0;
    const currentMonthTarget = monthlyTargets[currentYear]?.[currentMonth] || 0;

    // Books in progress
    const inProgress = books.filter(book => book.status === 'In Progress').length;

    // Completed books this year
    const completed = books.filter(book => {
      const bookYear = new Date(book.createdAt).getFullYear();
      return book.status === 'Done' && bookYear === currentYear;
    }).length;

    // Books near deadline (within 7 days)
    const today = new Date();
    const nearDeadline = books.filter(book => {
      const deadline = new Date(book.deadline);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && book.status !== 'Done';
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
    if (books.length > 0) {
      setKpiData(calculateKPIData());
    }
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