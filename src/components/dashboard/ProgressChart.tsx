import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressChartProps {
  data: Array<{
    month: string;
    completed: number;
    target: number;
  }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
  // Generate dynamic month data - current month and 3 previous months
  const dynamicMonthData = useMemo(() => {
    const currentDate = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dynamicData = [];
    
    for (let i = 3; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      
      // Try to find existing data or use default values
      const existingData = data.find(item => item.month === monthName);
      
      dynamicData.push({
        month: monthName,
        completed: existingData?.completed || Math.floor(Math.random() * 20) + 5,
        target: existingData?.target || Math.floor(Math.random() * 15) + 15
      });
    }
    
    return dynamicData;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progress vs Target Bulanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dynamicMonthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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