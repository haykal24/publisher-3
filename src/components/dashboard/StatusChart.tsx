import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/contexts/AppDataContext';

export function StatusChart() {
  const { books } = useAppData();

  // Calculate status distribution from real data
  const statusData = [
    {
      name: 'Belum Mulai',
      value: books.filter(book => book.status === 'Not Started').length,
      color: '#ef4444'
    },
    {
      name: 'Dalam Proses',
      value: books.filter(book => book.status === 'In Progress').length,
      color: '#3b82f6'
    },
    {
      name: 'Selesai',
      value: books.filter(book => book.status === 'Done').length,
      color: '#10b981'
    }
  ].filter(item => item.value > 0); // Only show statuses that have books

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status Buku</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} judul buku`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}