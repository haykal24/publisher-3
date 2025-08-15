import { Target, TrendingUp, Calendar } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function Targets() {
  const [monthFilter, setMonthFilter] = useState('08');
  const [yearFilter, setYearFilter] = useState('2024');

  const monthlyData = [
    { month: 'Jan', completed: 8, target: 10 },
    { month: 'Feb', completed: 9, target: 10 },
    { month: 'Mar', completed: 7, target: 10 },
    { month: 'Apr', completed: 10, target: 10 },
    { month: 'Mei', completed: 8, target: 10 },
    { month: 'Jun', completed: 9, target: 10 },
    { month: 'Jul', completed: 10, target: 10 },
    { month: 'Agu', completed: 6, target: 10 },
    { month: 'Sep', completed: 0, target: 10 },
    { month: 'Okt', completed: 0, target: 10 },
    { month: 'Nov', completed: 0, target: 10 },
    { month: 'Des', completed: 0, target: 10 },
  ];

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
          value={67}
          subtitle="% dari target"
          variant="success"
          icon={<Target className="w-8 h-8" />}
        />
        <KPICard
          title="Pencapaian vs Target (YTD)"
          value={80}
          subtitle="dari 120 target"
          variant="accent"
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <KPICard
          title="Rata-rata Buku/Bulan"
          value={10}
          subtitle="realisasi"
          variant="default"
          icon={<Calendar className="w-8 h-8" />}
        />
      </div>

      <ProgressChart data={monthlyData} />
    </div>
  );
}