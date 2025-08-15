import { supabase } from '@/integrations/supabase/client';
import type { Book, Task, Manuscript, TeamMember, Target, CalendarEvent } from '@/types';

// Books service
export const booksService = {
  async getAll() {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        tasks (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data?.map(book => ({
      ...book,
      tasks: book.tasks || []
    })) || [];
  },

  async create(book: Omit<Book, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: book.title,
        author: book.author,
        pic: book.pic,
        publisher: book.publisher,
        progress: book.progress,
        completed_tasks: book.completedTasks,
        total_tasks: book.totalTasks,
        status: book.status,
        deadline: book.deadline
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Book>) {
    const { data, error } = await supabase
      .from('books')
      .update({
        title: updates.title,
        author: updates.author,
        pic: updates.pic,
        publisher: updates.publisher,
        progress: updates.progress,
        completed_tasks: updates.completedTasks,
        total_tasks: updates.totalTasks,
        status: updates.status,
        deadline: updates.deadline
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Tasks service
export const tasksService = {
  async getByBookId(bookId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(task: Omit<Task, 'id'> & { bookId: string }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        book_id: task.bookId,
        name: task.name,
        pic: task.pic,
        deadline: task.deadline,
        notes: task.notes,
        status: task.status
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        name: updates.name,
        pic: updates.pic,
        deadline: updates.deadline,
        notes: updates.notes,
        status: updates.status
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Manuscripts service
export const manuscriptsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('manuscripts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(manuscript: Omit<Manuscript, 'id'>) {
    const { data, error } = await supabase
      .from('manuscripts')
      .insert({
        title: manuscript.title,
        author: manuscript.author,
        date_received: manuscript.dateReceived,
        genre: manuscript.genre,
        status: manuscript.status
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Manuscript>) {
    const { data, error } = await supabase
      .from('manuscripts')
      .update({
        title: updates.title,
        author: updates.author,
        date_received: updates.dateReceived,
        genre: updates.genre,
        status: updates.status
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('manuscripts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Team members service
export const teamMembersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(member: Omit<TeamMember, 'id'>) {
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        password: member.password
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<TeamMember>) {
    const { data, error } = await supabase
      .from('team_members')
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        avatar: updates.avatar,
        password: updates.password
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Targets service
export const targetsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('targets')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(target: Omit<Target, 'id'>) {
    const { data, error } = await supabase
      .from('targets')
      .insert({
        year: target.year,
        annual_target: target.annualTarget,
        monthly_targets: target.monthlyTargets
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(year: number, updates: Partial<Target>) {
    const { data, error } = await supabase
      .from('targets')
      .update({
        annual_target: updates.annualTarget,
        monthly_targets: updates.monthlyTargets
      })
      .eq('year', year)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Calendar events service
export const calendarEventsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*, books(*)')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(event: Omit<CalendarEvent, 'id'>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        title: event.title,
        date: event.date,
        type: event.type,
        status: event.status,
        book_id: event.bookId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<CalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({
        title: updates.title,
        date: updates.date,
        type: updates.type,
        status: updates.status,
        book_id: updates.bookId
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};