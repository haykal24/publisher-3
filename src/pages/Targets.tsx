import { Target, TrendingUp, Calendar } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useAppData } from '@/contexts/AppDataContext';
import { useBooks } from '@/hooks/useSupabaseData';

export default function Targets() {
  const analytics = useRealTimeAnalytics();
  const { yearlyTargets, currentYear } = useAppData();
  const { books } = useBooks();
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  
  // Get available years from book data
  const availableYears = useMemo(() => {
    const years = books.map(book => new Date(book.deadline).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears;
  }, [books]);

  // All months data
  const allMonths = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];
  
  // Calculate KPIs from real-time data
  const currentYearTarget = yearlyTargets.find(t => t.year === currentYear)?.target || 0;
  const completedThisYear = analytics.completedBooks;
  const progressPercentage = currentYearTarget > 0 ? Math.round((completedThisYear / currentYearTarget) * 100) : 0;
  const averageBooksPerMonth = analytics.monthlyProgress.reduce((sum, month) => sum + month.completed, 0) / 12;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analisis Target Penerbitan</h1>
          <p className="text-muted-foreground">Perbandingan target dengan realisasi pencapaian</p>
        </div>
        <div className="flex gap-2">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              {allMonths.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Progres Tahunan"
          value={progressPercentage}
          subtitle="% dari target"
          variant="success"
          icon={<Target className="w-8 h-8" />}
        />
        <KPICard
          title="Pencapaian vs Target (YTD)"
          value={completedThisYear}
          subtitle={`dari ${currentYearTarget} target`}
          variant="accent"
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <KPICard
          title="Rata-rata Buku/Bulan"
          value={Math.round(averageBooksPerMonth)}
          subtitle="realisasi"
          variant="default"
          icon={<Calendar className="w-8 h-8" />}
        />
      </div>

      <ProgressChart showLastMonths={12} />
    </div>
  );
}