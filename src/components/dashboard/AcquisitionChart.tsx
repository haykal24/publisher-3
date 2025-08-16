import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useManuscripts } from '@/hooks/useSupabaseData';
import { useSettings } from '@/hooks/useSettings';

export function AcquisitionChart() {
  const { manuscripts } = useManuscripts();
  const { settings } = useSettings();
  
  // Calculate acquisition data for current year
  const acquisitionData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentYearTarget = settings.acquisitionTargets[currentYear]?.annual || 0;
    
    // Count manuscripts by status
    const currentYearManuscripts = manuscripts.filter(manuscript => 
      new Date(manuscript.dateReceived).getFullYear() === currentYear
    );
    
    const naskahMasuk = currentYearManuscripts.length;
    const naskahDitolak = currentYearManuscripts.filter(m => m.status === 'Ditolak').length;
    const realisasiTerbit = currentYearManuscripts.filter(m => m.status === 'Terbit').length;
    
    return [{
      name: 'Akuisisi',
      'Target Akuisisi': currentYearTarget,
      'Realisasi Terbit': realisasiTerbit,
      'Naskah Masuk': naskahMasuk,
      'Naskah Ditolak': naskahDitolak
    }];
  }, [manuscripts, settings.acquisitionTargets]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Target Akuisisi</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={acquisitionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="Target Akuisisi" 
              fill="hsl(var(--primary))" 
              name="Target Akuisisi"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Realisasi Terbit" 
              fill="hsl(var(--accent))" 
              name="Realisasi Terbit"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Naskah Masuk" 
              fill="hsl(var(--secondary))" 
              name="Naskah Masuk"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Naskah Ditolak" 
              fill="hsl(var(--destructive))" 
              name="Naskah Ditolak"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}