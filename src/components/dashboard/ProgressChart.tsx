import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

interface ProgressChartProps {
  showLastMonths?: number;
}

export function ProgressChart({ showLastMonths = 4 }: ProgressChartProps) {
  const { monthlyProgress } = useRealTimeAnalytics();
  
  // Get the last N months of data
  const displayData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    const lastMonthsData = [];
    for (let i = showLastMonths - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthData = monthlyProgress[monthIndex];
      if (monthData) {
        lastMonthsData.push(monthData);
      }
    }
    
    return lastMonthsData;
  }, [monthlyProgress, showLastMonths]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progress vs Target Bulanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="completed" 
              fill="hsl(var(--primary))" 
              name="Selesai"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="target" 
              fill="hsl(var(--accent))" 
              name="Target"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}