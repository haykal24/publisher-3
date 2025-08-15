import { BarChart, TrendingUp, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';
import { useAppData } from '@/contexts/AppDataContext';

export default function Analytics() {
  const { books } = useAppData();
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Extract unique years from book data
  const availableYears = useMemo(() => {
    const years = books.flatMap(book => {
      const bookYear = new Date(book.deadline).getFullYear();
      const createdYear = new Date(book.createdAt).getFullYear();
      return [bookYear, createdYear];
    });
    return [...new Set(years)].sort((a, b) => b - a);
  }, [books]);

  // Filter books based on selected month and year
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const bookDeadline = new Date(book.deadline);
      const bookMonth = String(bookDeadline.getMonth() + 1).padStart(2, '0');
      const bookYear = String(bookDeadline.getFullYear());
      
      const matchesMonth = monthFilter === 'all' || bookMonth === monthFilter;
      const matchesYear = yearFilter === 'all' || bookYear === yearFilter;
      
      return matchesMonth && matchesYear;
    });
  }, [books, monthFilter, yearFilter]);

  // Calculate analytics based on filtered books
  const analytics = useMemo(() => {
    const publishedBooks = filteredBooks.filter(book => book.status === 'Done').length;
    const booksInProcess = filteredBooks.filter(book => book.status === 'In Progress').length;
    const lateBooks = filteredBooks.filter(book => book.daysLeft < 0).length;
    const delayPercentage = filteredBooks.length > 0 ? Math.round((lateBooks / filteredBooks.length) * 100) : 0;

    return {
      publishedBooks,
      booksInProcess,
      delayPercentage,
      totalBooks: filteredBooks.length
    };
  }, [filteredBooks]);

  // Sample data for task completion time
  const taskCompletionData = [
    { task: 'Cover Design', days: 1 },
    { task: 'Pengantar & Endors', days: 8 },
    { task: 'Editing Naskah', days: 7 },
    { task: 'Draf PK & Peta Buku', days: 6 },
    { task: 'Layout', days: 9 },
    { task: 'Desain Peta Buku', days: 8 },
    { task: 'Print & Proofread Awal', days: 9 },
    { task: 'QC Isi & ACC Kover Final', days: 7 },
    { task: 'Finishing Produksi', days: 8 },
    { task: 'SPH', days: 5 },
    { task: 'PK Final', days: 5 },
    { task: 'Cetak Awal Dummy', days: 7 },
    { task: 'Proofread Akhir', days: 5 },
    { task: 'Input Akhir', days: 1 },
    { task: 'Cetak Dummy Digital Printing', days: 1 },
    { task: 'Naik Cetak', days: 1 },
    { task: 'Turun Cetak', days: 1 }
  ];

  // Sample data for team productivity
  const teamProductivityData = [
    { name: 'Sari Dewi', booksWorked: 12, tasksCompleted: 85, avgTimePerTask: '2.8 hari', performance: 90 },
    { name: 'Ahmad Rizki', booksWorked: 10, tasksCompleted: 72, avgTimePerTask: '3.2 hari', performance: 75 },
    { name: 'Maya Sari', booksWorked: 8, tasksCompleted: 68, avgTimePerTask: '2.9 hari', performance: 85 },
    { name: 'Budi Santoso', booksWorked: 15, tasksCompleted: 98, avgTimePerTask: '2.5 hari', performance: 95 },
    { name: 'Indira Putri', booksWorked: 6, tasksCompleted: 45, avgTimePerTask: '3.8 hari', performance: 60 },
    { name: 'Dr. Surya', booksWorked: 9, tasksCompleted: 76, avgTimePerTask: '3.1 hari', performance: 80 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analitik Kinerja</h1>
          <p className="text-muted-foreground">Metrik kinerja produksi dan tim</p>
        </div>
        <div className="flex gap-2">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Pilih Bulan" />
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
              <SelectItem value="all">Semua</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Rata-rata Waktu Produksi"
          value={65}
          subtitle="hari"
          variant="default"
          icon={<Clock className="w-8 h-8" />}
        />
        <KPICard
          title="Produksi Tercepat"
          value={42}
          subtitle="hari"
          variant="success"
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <KPICard
          title="Produksi Terlama"
          value={89}
          subtitle="hari"
          variant="warning"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
        <KPICard
          title="Buku Diterbitkan"
          value={analytics.publishedBooks}
          subtitle="periode ini"
          variant="success"
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <KPICard
          title="Buku Diproses"
          value={analytics.booksInProcess}
          subtitle="aktif"
          variant="accent"
          icon={<BarChart />}
        />
        <KPICard
          title="Tingkat Keterlambatan"
          value={analytics.delayPercentage}
          subtitle="persen"
          variant="default"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
      </div>

      {/* Task Completion Time Chart */}
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-semibold">Waktu Pengerjaan Rata-rata per Tugas (Hari)</h2>
        <div className="bg-gradient-to-br from-card via-card to-card/90 p-8 rounded-xl border shadow-lg backdrop-blur-sm">
          <div className="h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={taskCompletionData}
                layout="horizontal"
                margin={{ top: 20, right: 40, left: 160, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeOpacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  type="number" 
                  domain={[0, 10]} 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="task" 
                  width={150} 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '14px'
                  }}
                />
                <Bar 
                  dataKey="days" 
                  fill="url(#barGradient)" 
                  radius={[0, 4, 4, 0]}
                  strokeWidth={0}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Productivity Table */}
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-semibold">Produktivitas Tim</h2>
        <div className="bg-gradient-to-br from-card via-card to-card/90 rounded-xl border shadow-lg backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Nama Anggota</TableHead>
                <TableHead className="font-semibold">Jumlah Buku Dikerjakan</TableHead>
                <TableHead className="font-semibold">Tugas Selesai</TableHead>
                <TableHead className="font-semibold">Rata-rata Waktu per Tugas</TableHead>
                <TableHead className="font-semibold">Kinerja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamProductivityData.map((member, index) => (
                <TableRow key={index} className="hover:bg-muted/25 transition-colors duration-200">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.booksWorked}</TableCell>
                  <TableCell>{member.tasksCompleted}</TableCell>
                  <TableCell>{member.avgTimePerTask}</TableCell>
                  <TableCell>
                    <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-500 ease-out animate-fade-in" 
                        style={{ 
                          width: `${member.performance}%`,
                          background: `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 70%, hsl(var(--primary)/0.8) 100%)`
                        }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}