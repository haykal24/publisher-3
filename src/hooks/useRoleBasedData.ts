import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Book, Task, Manuscript } from '@/types';

export function useRoleBasedData() {
  const { profile } = useAuth();
  const { canViewAllData, userPublisher, isManager } = useRoleAccess();

  const filterBooksByRole = (books: Book[]): Book[] => {
    // Managers can see ALL books without filtering
    if (isManager || canViewAllData) {
      return books;
    }
    
    if (userPublisher) {
      return books.filter(book => book.publisher === userPublisher);
    }
    
    return [];
  };

  const filterTasksByRole = (tasks: Task[]): Task[] => {
    // Tasks are already filtered by books, so no additional filtering needed
    return tasks;
  };

  const filterManuscriptsByRole = (manuscripts: Manuscript[]): Manuscript[] => {
    // Manuscripts don't have publisher field in current schema
    // Return all for now
    return manuscripts;
  };

  const getDefaultPublisher = (): string => {
    if (userPublisher) {
      return userPublisher;
    }
    return 'Renebook'; // Default fallback
  };

  return {
    filterBooksByRole,
    filterTasksByRole,
    filterManuscriptsByRole,
    getDefaultPublisher,
    canViewAllData,
    userPublisher,
  };
}