import { Target, TrendingUp, Calendar } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useAppData } from '@/contexts/AppDataContext';

export default function Targets() {
  const analytics = useRealTimeAnalytics();
  const { yearlyTargets, currentYear } = useAppData();
  const [monthFilter, setMonthFilter] = useState('08');
  const [yearFilter, setYearFilter] = useState('2024');
  
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="08">Agustus</SelectItem>
              <SelectItem value="07">Juli</SelectItem>
              <SelectItem value="06">Juni</SelectItem>
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
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