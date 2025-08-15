import { useState } from 'react';
import { User, Settings, Target, FileText, Building2, Bell, Moon, Sun, Camera } from 'lucide-react';
import { TaskManagement } from '@/components/settings/TaskManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
export default function SettingsPage() {
  const {
    theme,
    setTheme
  } = useTheme();
  const [profileImage, setProfileImage] = useState<string>('/placeholder.svg');
  const [publishers, setPublishers] = useState(['Renebook', 'Turos Pustaka', 'Reneluv', 'Renekids', 'Milestone']);
  const [newPublisher, setNewPublisher] = useState('');
  const [yearlyTargets, setYearlyTargets] = useState([{
    year: 2024,
    target: 120
  }, {
    year: 2025,
    target: 150
  }]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [newYear, setNewYear] = useState('');
  const [monthlyTargets, setMonthlyTargets] = useState<{
    [year: number]: {
      [month: string]: number;
    };
  }>({
    2024: {
      'Jan': 10,
      'Feb': 10,
      'Mar': 10,
      'Apr': 10,
      'Mei': 10,
      'Jun': 10,
      'Jul': 10,
      'Agu': 10,
      'Sep': 10,
      'Okt': 10,
      'Nov': 10,
      'Des': 10
    },
    2025: {
      'Jan': 12,
      'Feb': 12,
      'Mar': 12,
      'Apr': 12,
      'Mei': 13,
      'Jun': 13,
      'Jul': 13,
      'Agu': 13,
      'Sep': 13,
      'Okt': 13,
      'Nov': 13,
      'Des': 13
    }
  });
  const [acquisitionTargets, setAcquisitionTargets] = useState([{
    year: 2024,
    target: 200
  }, {
    year: 2025,
    target: 250
  }]);
  const [selectedAcquisitionYear, setSelectedAcquisitionYear] = useState(2024);
  const [monthlyAcquisitionTargets, setMonthlyAcquisitionTargets] = useState<{
    [year: number]: {
      [month: string]: number;
    };
  }>({
    2024: {
      'Jan': 17,
      'Feb': 17,
      'Mar': 17,
      'Apr': 17,
      'Mei': 17,
      'Jun': 17,
      'Jul': 17,
      'Agu': 17,
      'Sep': 17,
      'Okt': 17,
      'Nov': 17,
      'Des': 16
    },
    2025: {
      'Jan': 21,
      'Feb': 21,
      'Mar': 21,
      'Apr': 21,
      'Mei': 21,
      'Jun': 21,
      'Jul': 21,
      'Agu': 21,
      'Sep': 21,
      'Okt': 21,
      'Nov': 21,
      'Des': 20
    }
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Format file harus JPG atau PNG');
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setProfileImage(result);
      toast.success('Foto profil berhasil diubah');
    };
    reader.readAsDataURL(file);
  };
  const handleAddYear = () => {
    const year = parseInt(newYear);
    if (!year || year < 2020 || year > 2050) {
      toast.error('Tahun harus antara 2020-2050');
      return;
    }
    if (yearlyTargets.some(t => t.year === year)) {
      toast.error('Tahun sudah ada');
      return;
    }
    setYearlyTargets(prev => [...prev, {
      year,
      target: 0
    }]);
    setMonthlyTargets(prev => ({
      ...prev,
      [year]: {
        'Jan': 0,
        'Feb': 0,
        'Mar': 0,
        'Apr': 0,
        'Mei': 0,
        'Jun': 0,
        'Jul': 0,
        'Agu': 0,
        'Sep': 0,
        'Okt': 0,
        'Nov': 0,
        'Des': 0
      }
    }));
    setNewYear('');
    setSelectedYear(year);
    toast.success(`Tahun ${year} berhasil ditambahkan`);
  };
  const handleDeleteYear = (year: number) => {
    if (yearlyTargets.length <= 1) {
      toast.error('Minimal harus ada satu tahun target');
      return;
    }
    setYearlyTargets(prev => prev.filter(t => t.year !== year));
    setMonthlyTargets(prev => {
      const newTargets = {
        ...prev
      };
      delete newTargets[year];
      return newTargets;
    });
    if (selectedYear === year) {
      const remainingYears = yearlyTargets.filter(t => t.year !== year);
      setSelectedYear(remainingYears[0].year);
    }
    toast.success(`Tahun ${year} berhasil dihapus`);
  };
  const handleAddPublisher = () => {
    if (!newPublisher.trim()) {
      toast.error('Nama penerbit tidak boleh kosong');
      return;
    }
    if (publishers.includes(newPublisher.trim())) {
      toast.error('Penerbit sudah ada');
      return;
    }
    setPublishers(prev => [...prev, newPublisher.trim()]);
    setNewPublisher('');
    toast.success('Penerbit berhasil ditambahkan');
  };
  const handleDeletePublisher = (publisherToDelete: string) => {
    setPublishers(prev => prev.filter(p => p !== publisherToDelete));
    toast.success('Penerbit berhasil dihapus');
  };
  return <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Akun & Sistem</h1>
        <p className="text-muted-foreground">Kelola profil, target, dan konfigurasi sistem</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profil Saya</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Tugas</span>
          </TabsTrigger>
          <TabsTrigger value="publishing-targets" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Target Terbit</span>
          </TabsTrigger>
          <TabsTrigger value="acquisition-targets" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Target Akuisisi</span>
          </TabsTrigger>
          <TabsTrigger value="publishers" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Penerbit</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImage} alt="Foto Profil" />
                    <AvatarFallback className="text-lg">AS</AvatarFallback>
                  </Avatar>
                  <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input id="profile-image-upload" type="file" accept="image/jpeg,image/jpg,image/png" className="hidden" onChange={handleImageUpload} />
                </div>
                <div>
                  <h3 className="font-semibold">Foto Profil</h3>
                  <p className="text-sm text-muted-foreground">Format: JPG, PNG</p>
                  <p className="text-sm text-muted-foreground">Ukuran maksimal: 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" defaultValue="Andi Setiawan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="andi@rtgpublishing.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select defaultValue="manajer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manajer">Manajer</SelectItem>
                      <SelectItem value="produksi">Produksi</SelectItem>
                      <SelectItem value="renebook">Renebook</SelectItem>
                      <SelectItem value="turos">Turos Pustaka</SelectItem>
                      <SelectItem value="reneluv">Reneluv</SelectItem>
                      <SelectItem value="renekids">Renekids</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password Baru</Label>
                  <Input id="password" type="password" placeholder="Kosongkan jika tidak ingin mengubah" />
                </div>
              </div>
              <Button className="w-full md:w-auto">Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Alur Kerja Tugas</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publishing-targets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Penerbitan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Year Selection with Add Button */}
              <div className="flex items-center gap-2">
                <Select value={selectedYear.toString()} onValueChange={value => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {yearlyTargets.map(yearTarget => <SelectItem key={yearTarget.year} value={yearTarget.year.toString()}>
                        {yearTarget.year}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => {
                const currentYear = new Date().getFullYear();
                const maxYear = Math.max(...yearlyTargets.map(t => t.year));
                const newYear = Math.max(currentYear, maxYear + 1);
                if (yearlyTargets.some(t => t.year === newYear)) {
                  toast.error('Tahun sudah ada');
                  return;
                }
                setYearlyTargets(prev => [...prev, {
                  year: newYear,
                  target: 0
                }]);
                setMonthlyTargets(prev => ({
                  ...prev,
                  [newYear]: {
                    'Jan': 0,
                    'Feb': 0,
                    'Mar': 0,
                    'Apr': 0,
                    'Mei': 0,
                    'Jun': 0,
                    'Jul': 0,
                    'Agu': 0,
                    'Sep': 0,
                    'Okt': 0,
                    'Nov': 0,
                    'Des': 0
                  }
                }));
                setSelectedYear(newYear);
                toast.success(`Tahun ${newYear} berhasil ditambahkan`);
              }} className="w-10 h-10 p-0">
                  +
                </Button>
              </div>

              {/* Annual Target */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Target Tahunan</h3>
                <Input type="number" value={yearlyTargets.find(t => t.year === selectedYear)?.target || 0} onChange={e => {
                const newTargets = yearlyTargets.map(t => t.year === selectedYear ? {
                  ...t,
                  target: parseInt(e.target.value) || 0
                } : t);
                setYearlyTargets(newTargets);
              }} className="w-full text-lg font-medium" placeholder="100" />
              </div>

              {/* Monthly Targets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Target Bulanan</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {monthlyTargets[selectedYear] && Object.entries(monthlyTargets[selectedYear]).map(([month, target]) => <div key={month} className="flex items-center justify-between">
                      <Label className="text-sm font-medium w-12">{month}</Label>
                      <Input type="number" value={target} onChange={e => {
                    setMonthlyTargets(prev => ({
                      ...prev,
                      [selectedYear]: {
                        ...prev[selectedYear],
                        [month]: parseInt(e.target.value) || 0
                      }
                    }));
                  }} className="w-16 text-center text-sm" />
                    </div>)}
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3" onClick={() => {
              toast.success('Target penerbitan berhasil disimpan');
            }}>
                Simpan Target
              </Button>
              
              
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquisition-targets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Akuisisi Naskah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Year Selection with Add Button */}
              <div className="flex items-center gap-2">
                <Select value={selectedAcquisitionYear.toString()} onValueChange={value => setSelectedAcquisitionYear(parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {acquisitionTargets.map(yearTarget => <SelectItem key={yearTarget.year} value={yearTarget.year.toString()}>
                        {yearTarget.year}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => {
                const currentYear = new Date().getFullYear();
                const maxYear = Math.max(...acquisitionTargets.map(t => t.year));
                const newYear = Math.max(currentYear, maxYear + 1);
                if (acquisitionTargets.some(t => t.year === newYear)) {
                  toast.error('Tahun sudah ada');
                  return;
                }
                setAcquisitionTargets(prev => [...prev, {
                  year: newYear,
                  target: 0
                }]);
                setMonthlyAcquisitionTargets(prev => ({
                  ...prev,
                  [newYear]: {
                    'Jan': 0,
                    'Feb': 0,
                    'Mar': 0,
                    'Apr': 0,
                    'Mei': 0,
                    'Jun': 0,
                    'Jul': 0,
                    'Agu': 0,
                    'Sep': 0,
                    'Okt': 0,
                    'Nov': 0,
                    'Des': 0
                  }
                }));
                setSelectedAcquisitionYear(newYear);
                toast.success(`Tahun ${newYear} berhasil ditambahkan`);
              }} className="w-10 h-10 p-0">
                  +
                </Button>
              </div>

              {/* Annual Target */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Target Tahunan</h3>
                <Input type="number" value={acquisitionTargets.find(t => t.year === selectedAcquisitionYear)?.target || 0} onChange={e => {
                const newTargets = acquisitionTargets.map(t => t.year === selectedAcquisitionYear ? {
                  ...t,
                  target: parseInt(e.target.value) || 0
                } : t);
                setAcquisitionTargets(newTargets);
              }} className="w-full text-lg font-medium" placeholder="200" />
              </div>

              {/* Monthly Targets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Target Bulanan</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {monthlyAcquisitionTargets[selectedAcquisitionYear] && Object.entries(monthlyAcquisitionTargets[selectedAcquisitionYear]).map(([month, target]) => <div key={month} className="flex items-center justify-between">
                      <Label className="text-sm font-medium w-12">{month}</Label>
                      <Input type="number" value={target} onChange={e => {
                    setMonthlyAcquisitionTargets(prev => ({
                      ...prev,
                      [selectedAcquisitionYear]: {
                        ...prev[selectedAcquisitionYear],
                        [month]: parseInt(e.target.value) || 0
                      }
                    }));
                  }} className="w-16 text-center text-sm" />
                    </div>)}
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3" onClick={() => {
              toast.success('Target akuisisi berhasil disimpan');
            }}>
                Simpan Target
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publishers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Penerbit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Kelola daftar penerbit yang tersedia dalam sistem.
                </p>
                <div className="flex flex-wrap gap-2">
                  {publishers.map(publisher => <Badge key={publisher} variant="secondary" className="text-sm py-2 px-4">
                      {publisher}
                      <Button size="sm" variant="ghost" className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDeletePublisher(publisher)}>
                        ×
                      </Button>
                    </Badge>)}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Nama penerbit baru" className="flex-1" value={newPublisher} onChange={e => setNewPublisher(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddPublisher()} />
                  <Button onClick={handleAddPublisher}>Tambah</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deadline Mendekat</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat deadline buku kurang dari 7 hari</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tugas Baru</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat mendapat tugas baru</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Naskah Masuk</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat ada naskah baru masuk</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Target Tercapai</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat target bulanan tercapai</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Harian</p>
                    <p className="text-sm text-muted-foreground">Ringkasan harian melalui email</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Button>Simpan Pengaturan Notifikasi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tampilan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Mode Tampilan</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Pilih tema yang ingin digunakan untuk aplikasi
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} className="h-20 flex-col gap-2">
                    <Sun className="w-6 h-6" />
                    <span>Terang</span>
                  </Button>
                  <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="h-20 flex-col gap-2">
                    <Moon className="w-6 h-6" />
                    <span>Gelap</span>
                  </Button>
                  <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')} className="h-20 flex-col gap-2">
                    <Settings className="w-6 h-6" />
                    <span>Sistem</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}