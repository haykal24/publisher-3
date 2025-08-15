import { useState, useEffect } from 'react';
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
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, loading, updateSetting } = useSettings();
  const [profileImage, setProfileImage] = useState<string>('/placeholder.svg');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: 'Andi Setiawan',
    email: 'andi@rtgpublishing.com',
    role: 'manajer',
    password: ''
  });
  
  // Local state that mirrors settings for immediate UI updates
  const [publishers, setPublishers] = useState<string[]>([]);
  const [newPublisher, setNewPublisher] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedAcquisitionYear, setSelectedAcquisitionYear] = useState(2024);

  // Initialize local state from database settings
  useEffect(() => {
    if (!loading && settings) {
      setPublishers(settings.publishers || []);
      const firstYear = Object.keys(settings.publishingTargets)[0];
      if (firstYear) {
        setSelectedYear(parseInt(firstYear));
      }
      const firstAcqYear = Object.keys(settings.acquisitionTargets)[0];
      if (firstAcqYear) {
        setSelectedAcquisitionYear(parseInt(firstAcqYear));
      }
    }
  }, [loading, settings]);

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

  const handleSaveProfile = async () => {
    try {
      // Save profile data to settings
      await updateSetting('user_profile', {
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        avatar: profileImage
      });
      
      toast.success('Profil berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan profil');
    }
  };

  const handleAddPublisher = async () => {
    if (!newPublisher.trim()) {
      toast.error('Nama penerbit tidak boleh kosong');
      return;
    }
    if (publishers.includes(newPublisher.trim())) {
      toast.error('Penerbit sudah ada');
      return;
    }
    
    const newPublishers = [...publishers, newPublisher.trim()];
    setPublishers(newPublishers);
    await updateSetting('publishers', newPublishers);
    setNewPublisher('');
  };

  const handleDeletePublisher = async (publisherToDelete: string) => {
    const newPublishers = publishers.filter(p => p !== publisherToDelete);
    setPublishers(newPublishers);
    await updateSetting('publishers', newPublishers);
  };

  const handleSavePublishingTargets = async () => {
    await updateSetting('publishing_targets', settings.publishingTargets);
  };

  const handleSaveAcquisitionTargets = async () => {
    await updateSetting('acquisition_targets', settings.acquisitionTargets);
  };

  const handleSaveNotifications = async () => {
    await updateSetting('notification_settings', settings.notificationSettings);
  };

  const updatePublishingTarget = (year: string, field: 'annual' | string, value: number) => {
    const updatedTargets = {
      ...settings.publishingTargets,
      [year]: {
        ...settings.publishingTargets[year],
        [field]: value
      }
    };
    // Update in hook would be needed here for real-time updates
  };

  const updateMonthlyTarget = (year: string, month: string, value: number) => {
    const updatedTargets = {
      ...settings.publishingTargets,
      [year]: {
        ...settings.publishingTargets[year],
        monthly: {
          ...settings.publishingTargets[year]?.monthly,
          [month]: value
        }
      }
    };
    // Update in hook would be needed here for real-time updates
  };

  const addNewYear = async (type: 'publishing' | 'acquisition') => {
    const currentYear = new Date().getFullYear();
    const existingYears = Object.keys(type === 'publishing' ? settings.publishingTargets : settings.acquisitionTargets).map(y => parseInt(y));
    const maxYear = Math.max(...existingYears);
    const newYear = Math.max(currentYear, maxYear + 1);
    
    if (existingYears.includes(newYear)) {
      toast.error('Tahun sudah ada');
      return;
    }

    const newYearData = {
      annual: 0,
      monthly: {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'Mei': 0, 'Jun': 0,
        'Jul': 0, 'Agu': 0, 'Sep': 0, 'Okt': 0, 'Nov': 0, 'Des': 0
      }
    };

    if (type === 'publishing') {
      const updatedTargets = {
        ...settings.publishingTargets,
        [newYear]: newYearData
      };
      await updateSetting('publishing_targets', updatedTargets);
      setSelectedYear(newYear);
    } else {
      const updatedTargets = {
        ...settings.acquisitionTargets,
        [newYear]: newYearData
      };
      await updateSetting('acquisition_targets', updatedTargets);
      setSelectedAcquisitionYear(newYear);
    }

    toast.success(`Tahun ${newYear} berhasil ditambahkan`);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Akun & Sistem</h1>
        <p className="text-muted-foreground">Kelola profil, target, dan konfigurasi sistem</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profil</span>
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
                  <Input 
                    id="name" 
                    value={profileData.name} 
                    onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select 
                    value={profileData.role} 
                    onValueChange={value => setProfileData(prev => ({ ...prev, role: value }))}
                  >
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
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    value={profileData.password}
                    onChange={e => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <Button className="w-full md:w-auto" onClick={handleSaveProfile}>Simpan Perubahan</Button>
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
              <div className="flex items-center gap-2">
                <Select value={selectedYear.toString()} onValueChange={value => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(settings.publishingTargets).map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => addNewYear('publishing')} className="w-10 h-10 p-0">
                  +
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Target Tahunan</h3>
                <Input 
                  type="number" 
                  value={settings.publishingTargets[selectedYear]?.annual || 0} 
                  onChange={e => updatePublishingTarget(selectedYear.toString(), 'annual', parseInt(e.target.value) || 0)}
                  className="w-full text-lg font-medium" 
                  placeholder="100" 
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Target Bulanan</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {settings.publishingTargets[selectedYear]?.monthly && Object.entries(settings.publishingTargets[selectedYear].monthly).map(([month, target]) => (
                    <div key={month} className="flex items-center justify-between">
                      <Label className="text-sm font-medium w-12">{month}</Label>
                      <Input 
                        type="number" 
                        value={target} 
                        onChange={e => updateMonthlyTarget(selectedYear.toString(), month, parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-sm" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3" 
                onClick={handleSavePublishingTargets}
              >
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
              <div className="flex items-center gap-2">
                <Select value={selectedAcquisitionYear.toString()} onValueChange={value => setSelectedAcquisitionYear(parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(settings.acquisitionTargets).map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => addNewYear('acquisition')} className="w-10 h-10 p-0">
                  +
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Target Tahunan</h3>
                <Input 
                  type="number" 
                  value={settings.acquisitionTargets[selectedAcquisitionYear]?.annual || 0} 
                  className="w-full text-lg font-medium" 
                  placeholder="200" 
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Target Bulanan</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {settings.acquisitionTargets[selectedAcquisitionYear]?.monthly && Object.entries(settings.acquisitionTargets[selectedAcquisitionYear].monthly).map(([month, target]) => (
                    <div key={month} className="flex items-center justify-between">
                      <Label className="text-sm font-medium w-12">{month}</Label>
                      <Input 
                        type="number" 
                        value={target} 
                        className="w-16 text-center text-sm" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3" 
                onClick={handleSaveAcquisitionTargets}
              >
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
                  {publishers.map(publisher => (
                    <Badge key={publisher} variant="secondary" className="text-sm py-2 px-4">
                      {publisher}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground" 
                        onClick={() => handleDeletePublisher(publisher)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nama penerbit baru" 
                    className="flex-1" 
                    value={newPublisher} 
                    onChange={e => setNewPublisher(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleAddPublisher()} 
                  />
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
                  <Switch checked={settings.notificationSettings.deadline_alerts} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tugas Baru</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat mendapat tugas baru</p>
                  </div>
                  <Switch checked={settings.notificationSettings.task_reminders} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifikasi</p>
                    <p className="text-sm text-muted-foreground">Menerima notifikasi melalui email</p>
                  </div>
                  <Switch checked={settings.notificationSettings.email} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifikasi</p>
                    <p className="text-sm text-muted-foreground">Menerima notifikasi push</p>
                  </div>
                  <Switch checked={settings.notificationSettings.push} />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications}>Simpan Pengaturan Notifikasi</Button>
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
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    onClick={() => setTheme('light')} 
                    className="h-20 flex-col gap-2"
                  >
                    <Sun className="w-6 h-6" />
                    <span>Terang</span>
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    onClick={() => setTheme('dark')} 
                    className="h-20 flex-col gap-2"
                  >
                    <Moon className="w-6 h-6" />
                    <span>Gelap</span>
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    onClick={() => setTheme('system')} 
                    className="h-20 flex-col gap-2"
                  >
                    <Settings className="w-6 h-6" />
                    <span>Sistem</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}