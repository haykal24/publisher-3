export interface Task {
  id: string;
  name: string;
  pic: string;
  deadline: string;
  daysLeft: number;
  notes: string;
  status: 'Not Started' | 'In Progress' | 'Done';
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  pic: string;
  publisher: 'Renebook' | 'Turos Pustaka' | 'Reneluv' | 'Renekids' | 'Milestone';
  progress: number;
  completedTasks: number;
  totalTasks: number;
  status: 'Not Started' | 'In Progress' | 'Done';
  deadline: string;
  daysLeft: number;
  tasks: Task[];
  createdAt: string;
}

export interface Manuscript {
  id: string;
  title: string;
  author: string;
  dateReceived: string;
  genre: string;
  status: 'Baru Masuk' | 'Review' | 'Diterima' | 'Ditolak' | 'Terbit';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Manajer' | 'Produksi' | 'Renebook' | 'Turos Pustaka' | 'Reneluv' | 'Renekids' | 'Milestone';
  avatar: string;
  password: string;
}

export interface KPIData {
  yearTarget: number;
  monthTarget: number;
  inProgress: number;
  completed: number;
  nearDeadline: number;
}

export interface AnalyticsData {
  avgProductionTime: number;
  fastestProduction: number;
  slowestProduction: number;
  publishedBooks: number;
  booksInProcess: number;
  delayPercentage: number;
}

export interface Target {
  year: number;
  annualTarget: number;
  monthlyTargets: {
    [key: string]: number; // Januari, Februari, etc.
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'milestone';
  status: 'in-progress' | 'completed' | 'near-deadline';
  bookId: string;
}