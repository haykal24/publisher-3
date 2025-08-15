import { Book, Manuscript, TeamMember, KPIData, Task, CalendarEvent } from '@/types';

// Sample tasks for books
export const defaultTasks: Omit<Task, 'id'>[] = [
  { name: 'Cover Design', pic: 'Andi Setiawan', deadline: '2024-08-20', daysLeft: 5, notes: '', status: 'In Progress' },
  { name: 'Pengantar & Endors', pic: 'Sari Dewi', deadline: '2024-08-22', daysLeft: 7, notes: '', status: 'Not Started' },
  { name: 'Editing Naskah', pic: 'Budi Hartono', deadline: '2024-08-25', daysLeft: 10, notes: '', status: 'Not Started' },
  { name: 'Draf PK & Peta Buku', pic: 'Lisa Permata', deadline: '2024-08-28', daysLeft: 13, notes: '', status: 'Not Started' },
  { name: 'Layout', pic: 'Rudi Santoso', deadline: '2024-09-02', daysLeft: 18, notes: '', status: 'Not Started' },
  { name: 'Desain Peta Buku', pic: 'Maya Sari', deadline: '2024-09-05', daysLeft: 21, notes: '', status: 'Not Started' },
  { name: 'Print & Proofread Awal', pic: 'Eko Prasetyo', deadline: '2024-09-08', daysLeft: 24, notes: '', status: 'Not Started' },
  { name: 'QC Isi & ACC Kover Final', pic: 'Nina Indira', deadline: '2024-09-12', daysLeft: 28, notes: '', status: 'Not Started' },
  { name: 'Finishing Produksi', pic: 'Dian Kartika', deadline: '2024-09-15', daysLeft: 31, notes: '', status: 'Not Started' },
  { name: 'SPH', pic: 'Agus Wijaya', deadline: '2024-09-18', daysLeft: 34, notes: '', status: 'Not Started' },
  { name: 'PK Final', pic: 'Rita Maharani', deadline: '2024-09-22', daysLeft: 38, notes: '', status: 'Not Started' },
  { name: 'Cetak Awal Dummy', pic: 'Fajri Rahman', deadline: '2024-09-25', daysLeft: 41, notes: '', status: 'Not Started' },
  { name: 'Proofread Akhir', pic: 'Indah Lestari', deadline: '2024-09-28', daysLeft: 44, notes: '', status: 'Not Started' },
  { name: 'Input Akhir', pic: 'Hendra Kusuma', deadline: '2024-10-02', daysLeft: 48, notes: '', status: 'Not Started' },
  { name: 'Cetak Dummy Digital', pic: 'Tari Wulandari', deadline: '2024-10-05', daysLeft: 51, notes: '', status: 'Not Started' },
  { name: 'Naik Cetak', pic: 'Bayu Pratama', deadline: '2024-10-08', daysLeft: 54, notes: '', status: 'Not Started' },
  { name: 'Turun Cetak', pic: 'Citra Melati', deadline: '2024-10-12', daysLeft: 58, notes: '', status: 'Not Started' }
];

export const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'Panduan Komprehensif JavaScript Modern',
    pic: 'Andi Setiawan',
    publisher: 'Renebook',
    progress: 25,
    completedTasks: 4,
    totalTasks: 17,
    status: 'In Progress',
    deadline: '2024-10-12',
    daysLeft: 58,
    tasks: defaultTasks.map((task, index) => ({
      ...task,
      id: `1-${index + 1}`,
      status: index < 4 ? 'Done' : task.status
    })),
    createdAt: '2024-07-15'
  },
  {
    id: '2',
    title: 'Seni Memasak Tradisional Nusantara',
    pic: 'Sari Dewi',
    publisher: 'Reneluv',
    progress: 65,
    completedTasks: 11,
    totalTasks: 17,
    status: 'In Progress',
    deadline: '2024-09-28',
    daysLeft: 44,
    tasks: defaultTasks.map((task, index) => ({
      ...task,
      id: `2-${index + 1}`,
      status: index < 11 ? 'Done' : task.status
    })),
    createdAt: '2024-06-20'
  },
  {
    id: '3',
    title: 'Petualangan Si Kancil dan Teman-Teman',
    pic: 'Maya Sari',
    publisher: 'Renekids',
    progress: 90,
    completedTasks: 15,
    totalTasks: 17,
    status: 'In Progress',
    deadline: '2024-08-25',
    daysLeft: 10,
    tasks: defaultTasks.map((task, index) => ({
      ...task,
      id: `3-${index + 1}`,
      status: index < 15 ? 'Done' : task.status
    })),
    createdAt: '2024-05-10'
  },
  {
    id: '4',
    title: 'Strategi Bisnis Digital Era 4.0',
    pic: 'Budi Hartono',
    publisher: 'Turos Pustaka',
    progress: 10,
    completedTasks: 2,
    totalTasks: 17,
    status: 'In Progress',
    deadline: '2024-11-15',
    daysLeft: 92,
    tasks: defaultTasks.map((task, index) => ({
      ...task,
      id: `4-${index + 1}`,
      status: index < 2 ? 'Done' : task.status
    })),
    createdAt: '2024-08-01'
  },
  {
    id: '5',
    title: 'Milestone dalam Kepemimpinan',
    pic: 'Lisa Permata',
    publisher: 'Milestone',
    progress: 100,
    completedTasks: 17,
    totalTasks: 17,
    status: 'Done',
    deadline: '2024-08-01',
    daysLeft: -14,
    tasks: defaultTasks.map((task, index) => ({
      ...task,
      id: `5-${index + 1}`,
      status: 'Done'
    })),
    createdAt: '2024-04-15'
  }
];

export const sampleManuscripts: Manuscript[] = [
  {
    id: '1',
    title: 'AI dalam Kehidupan Sehari-hari',
    author: 'Dr. Ahmad Fauzi',
    dateReceived: '2024-08-10',
    genre: 'Teknologi',
    status: 'Review'
  },
  {
    id: '2',
    title: 'Resep Warisan Nenek',
    author: 'Ibu Siti Aminah',
    dateReceived: '2024-08-12',
    genre: 'Kuliner',
    status: 'Diterima'
  },
  {
    id: '3',
    title: 'Dongeng Anak Nusantara',
    author: 'Kakak Cerita',
    dateReceived: '2024-08-14',
    genre: 'Anak-anak',
    status: 'Baru Masuk'
  },
  {
    id: '4',
    title: 'Investasi untuk Pemula',
    author: 'Prof. Budi Santoso',
    dateReceived: '2024-08-05',
    genre: 'Keuangan',
    status: 'Ditolak'
  }
];

export const sampleTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Andi Setiawan',
    email: 'andi@rtgpublishing.com',
    role: 'Manajer',
    avatar: 'AS',
    password: '******'
  },
  {
    id: '2',
    name: 'Sari Dewi',
    email: 'sari@rtgpublishing.com',
    role: 'Produksi',
    avatar: 'SD',
    password: '******'
  },
  {
    id: '3',
    name: 'Budi Hartono',
    email: 'budi@rtgpublishing.com',
    role: 'Renebook',
    avatar: 'BH',
    password: '******'
  },
  {
    id: '4',
    name: 'Maya Sari',
    email: 'maya@rtgpublishing.com',
    role: 'Renekids',
    avatar: 'MS',
    password: '******'
  }
];

export const kpiData: KPIData = {
  yearTarget: 120,
  monthTarget: 10,
  inProgress: 15,
  completed: 8,
  nearDeadline: 3
};

export const chartData = {
  statusDistribution: [
    { name: 'Belum Mulai', value: 20, color: '#94a3b8' },
    { name: 'Dalam Proses', value: 65, color: '#3b82f6' },
    { name: 'Selesai', value: 15, color: '#10b981' }
  ],
  monthlyProgress: [
    { month: 'Jan', completed: 8, target: 10 },
    { month: 'Feb', completed: 12, target: 10 },
    { month: 'Mar', completed: 9, target: 10 },
    { month: 'Apr', completed: 11, target: 10 },
    { month: 'Mei', completed: 7, target: 10 },
    { month: 'Jun', completed: 10, target: 10 },
    { month: 'Jul', completed: 8, target: 10 },
    { month: 'Agu', completed: 6, target: 10 }
  ]
};

// Calendar events based on book deadlines and milestones
export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Deadline: Panduan JavaScript Modern',
    date: '2024-10-12',
    type: 'deadline',
    status: 'in-progress',
    bookId: '1'
  },
  {
    id: '2',
    title: 'Deadline: Seni Memasak Tradisional',
    date: '2024-09-28',
    type: 'deadline',
    status: 'near-deadline',
    bookId: '2'
  },
  {
    id: '3',
    title: 'Deadline: Petualangan Si Kancil',
    date: '2024-08-25',
    type: 'deadline',
    status: 'near-deadline',
    bookId: '3'
  },
  {
    id: '4',
    title: 'Deadline: Strategi Bisnis Digital',
    date: '2024-11-15',
    type: 'deadline',
    status: 'in-progress',
    bookId: '4'
  },
  {
    id: '5',
    title: 'Selesai: Milestone Kepemimpinan',
    date: '2024-08-01',
    type: 'milestone',
    status: 'completed',
    bookId: '5'
  },
  {
    id: '6',
    title: 'Cover Design - JavaScript',
    date: '2024-08-20',
    type: 'milestone',
    status: 'near-deadline',
    bookId: '1'
  },
  {
    id: '7',
    title: 'Layout - Seni Memasak',
    date: '2024-09-02',
    type: 'milestone',
    status: 'in-progress',
    bookId: '2'
  },
  {
    id: '8',
    title: 'QC Final - Si Kancil',
    date: '2024-09-12',
    type: 'milestone',
    status: 'in-progress',
    bookId: '3'
  }
];