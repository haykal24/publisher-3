import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  booksService, 
  tasksService, 
  manuscriptsService, 
  teamMembersService,
  targetsService,
  calendarEventsService 
} from '@/services/supabaseService';
import type { Book, Manuscript, TeamMember, Target } from '@/types';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await booksService.getAll();
      const transformedBooks = data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        pic: book.pic,
        publisher: book.publisher,
        progress: book.progress,
        completedTasks: book.completed_tasks,
        totalTasks: book.total_tasks,
        status: book.status,
        deadline: book.deadline,
        daysLeft: book.days_left || 0,
        tasks: (book.tasks || []).map((task: any) => ({
          id: task.id,
          name: task.name,
          pic: task.pic,
          deadline: task.deadline,
          daysLeft: task.days_left || 0,
          notes: task.notes || '',
          status: task.status
        })),
        createdAt: book.created_at
      }));
      setBooks(transformedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Gagal memuat data buku');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Omit<Book, 'id' | 'createdAt'>) => {
    try {
      await booksService.create(book);
      await loadBooks();
      toast.success('Buku berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Gagal menambahkan buku');
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      await booksService.update(id, updates);
      await loadBooks();
      toast.success('Buku berhasil diperbarui');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Gagal memperbarui buku');
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksService.delete(id);
      await loadBooks();
      toast.success('Buku berhasil dihapus');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Gagal menghapus buku');
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    refetch: loadBooks
  };
}

export function useManuscripts() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);

  const loadManuscripts = async () => {
    try {
      setLoading(true);
      const data = await manuscriptsService.getAll();
      const transformedManuscripts = data.map((manuscript: any) => ({
        id: manuscript.id,
        title: manuscript.title,
        author: manuscript.author,
        dateReceived: manuscript.date_received,
        genre: manuscript.genre,
        status: manuscript.status
      }));
      setManuscripts(transformedManuscripts);
    } catch (error) {
      console.error('Error loading manuscripts:', error);
      toast.error('Gagal memuat data naskah');
    } finally {
      setLoading(false);
    }
  };

  const addManuscript = async (manuscript: Omit<Manuscript, 'id'>) => {
    try {
      await manuscriptsService.create(manuscript);
      await loadManuscripts();
      toast.success('Naskah berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding manuscript:', error);
      toast.error('Gagal menambahkan naskah');
    }
  };

  const updateManuscript = async (id: string, updates: Partial<Manuscript>) => {
    try {
      await manuscriptsService.update(id, updates);
      await loadManuscripts();
      toast.success('Naskah berhasil diperbarui');
    } catch (error) {
      console.error('Error updating manuscript:', error);
      toast.error('Gagal memperbarui naskah');
    }
  };

  const deleteManuscript = async (id: string) => {
    try {
      await manuscriptsService.delete(id);
      await loadManuscripts();
      toast.success('Naskah berhasil dihapus');
    } catch (error) {
      console.error('Error deleting manuscript:', error);
      toast.error('Gagal menghapus naskah');
    }
  };

  useEffect(() => {
    loadManuscripts();
  }, []);

  return {
    manuscripts,
    loading,
    addManuscript,
    updateManuscript,
    deleteManuscript,
    refetch: loadManuscripts
  };
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await teamMembersService.getAll();
      const transformedTeamMembers = data.map((member: any) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        password: member.password
      }));
      setTeamMembers(transformedTeamMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Gagal memuat data tim');
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      await teamMembersService.create(member);
      await loadTeamMembers();
      toast.success('Anggota tim berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Gagal menambahkan anggota tim');
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      await teamMembersService.update(id, updates);
      await loadTeamMembers();
      toast.success('Anggota tim berhasil diperbarui');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Gagal memperbarui anggota tim');
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await teamMembersService.delete(id);
      await loadTeamMembers();
      toast.success('Anggota tim berhasil dihapus');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Gagal menghapus anggota tim');
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: loadTeamMembers
  };
}

export function useTargets() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const data = await targetsService.getAll();
      const transformedTargets = data.map((target: any) => ({
        year: target.year,
        annualTarget: target.annual_target,
        monthlyTargets: target.monthly_targets || {}
      }));
      setTargets(transformedTargets);
    } catch (error) {
      console.error('Error loading targets:', error);
      toast.error('Gagal memuat data target');
    } finally {
      setLoading(false);
    }
  };

  const addTarget = async (target: Omit<Target, 'id'>) => {
    try {
      await targetsService.create(target);
      await loadTargets();
      toast.success('Target berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding target:', error);
      toast.error('Gagal menambahkan target');
    }
  };

  const updateTarget = async (year: number, updates: Partial<Target>) => {
    try {
      await targetsService.update(year, updates);
      await loadTargets();
      toast.success('Target berhasil diperbarui');
    } catch (error) {
      console.error('Error updating target:', error);
      toast.error('Gagal memperbarui target');
    }
  };

  useEffect(() => {
    loadTargets();
  }, []);

  return {
    targets,
    loading,
    addTarget,
    updateTarget,
    refetch: loadTargets
  };
}