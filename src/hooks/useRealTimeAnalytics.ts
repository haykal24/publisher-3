import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBooks, useTargets } from './useSupabaseData';

export interface AnalyticsData {
  // Book statistics
  totalBooks: number;
  completedBooks: number;
  booksInProgress: number;
  booksNotStarted: number;
  booksNearDeadline: number;
  
  // Time-based analytics
  averageCompletionTime: number;
  fastestCompletion: number;
  slowestCompletion: number;
  
  // Monthly progress data
  monthlyProgress: Array<{
    month: string;
    completed: number;
    target: number;
    percentage: number;
  }>;
  
  // Status distribution
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  
  // Publisher statistics
  publisherStats: Array<{
    publisher: string;
    books: number;
    completed: number;
    percentage: number;
  }>;
  
  // Real-time metrics
  lastUpdated: Date;
}

export function useRealTimeAnalytics() {
  const { books } = useBooks();
  const { targets } = useTargets();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books'
        },
        () => {
          setLastUpdated(new Date());
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'targets'
        },
        () => {
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate analytics data
  const analyticsData: AnalyticsData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    
    // Book statistics
    const totalBooks = books.length;
    const completedBooks = books.filter(book => book.status === 'Done').length;
    const booksInProgress = books.filter(book => book.status === 'In Progress').length;
    const booksNotStarted = books.filter(book => book.status === 'Not Started').length;
    
    // Books near deadline (within 7 days)
    const booksNearDeadline = books.filter(book => {
      const deadline = new Date(book.deadline);
      const diffTime = deadline.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && book.status !== 'Done';
    }).length;
    
    // Time-based analytics (in days)
    const completedBooksWithDates = books.filter(book => 
      book.status === 'Done' && book.createdAt && book.deadline
    );
    
    let averageCompletionTime = 0;
    let fastestCompletion = Infinity;
    let slowestCompletion = 0;
    
    if (completedBooksWithDates.length > 0) {
      const completionTimes = completedBooksWithDates.map(book => {
        const start = new Date(book.createdAt);
        const end = new Date(book.deadline);
        return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      });
      
      averageCompletionTime = Math.round(
        completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      );
      fastestCompletion = Math.round(Math.min(...completionTimes));
      slowestCompletion = Math.round(Math.max(...completionTimes));
    }
    
    // Monthly progress data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYearTarget = targets.find(t => t.year === currentYear);
    
    const monthlyProgress = months.map((month, index) => {
      // Count completed books for this month
      const completedInMonth = books.filter(book => {
        if (book.status !== 'Done') return false;
        const bookDate = new Date(book.createdAt);
        return bookDate.getFullYear() === currentYear && bookDate.getMonth() === index;
      }).length;
      
      // Get target for this month
      const monthTarget = currentYearTarget?.monthlyTargets?.[month] || 0;
      const percentage = monthTarget > 0 ? Math.round((completedInMonth / monthTarget) * 100) : 0;
      
      return {
        month,
        completed: completedInMonth,
        target: monthTarget,
        percentage
      };
    });
    
    // Status distribution
    const statusDistribution = [
      {
        name: 'Belum Mulai',
        value: booksNotStarted,
        color: '#ef4444'
      },
      {
        name: 'Dalam Proses',
        value: booksInProgress,
        color: '#3b82f6'
      },
      {
        name: 'Selesai',
        value: completedBooks,
        color: '#10b981'
      }
    ].filter(item => item.value > 0);
    
    // Publisher statistics
    const publisherGroups = books.reduce((acc, book) => {
      if (!acc[book.publisher]) {
        acc[book.publisher] = { total: 0, completed: 0 };
      }
      acc[book.publisher].total++;
      if (book.status === 'Done') {
        acc[book.publisher].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
    
    const publisherStats = Object.entries(publisherGroups).map(([publisher, stats]) => ({
      publisher,
      books: stats.total,
      completed: stats.completed,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));
    
    return {
      totalBooks,
      completedBooks,
      booksInProgress,
      booksNotStarted,
      booksNearDeadline,
      averageCompletionTime,
      fastestCompletion: fastestCompletion === Infinity ? 0 : fastestCompletion,
      slowestCompletion,
      monthlyProgress,
      statusDistribution,
      publisherStats,
      lastUpdated
    };
  }, [books, targets, lastUpdated]);

  return analyticsData;
}