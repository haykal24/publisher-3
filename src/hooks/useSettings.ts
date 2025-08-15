import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Settings {
  publishers: string[];
  publishingTargets: {
    [year: string]: {
      annual: number;
      monthly: { [month: string]: number };
    };
  };
  acquisitionTargets: {
    [year: string]: {
      annual: number;
      monthly: { [month: string]: number };
    };
  };
  notificationSettings: {
    email: boolean;
    push: boolean;
    deadline_alerts: boolean;
    task_reminders: boolean;
  };
  appearanceSettings: {
    theme: string;
    language: string;
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    publishers: [],
    publishingTargets: {},
    acquisitionTargets: {},
    notificationSettings: {
      email: true,
      push: false,
      deadline_alerts: true,
      task_reminders: true
    },
    appearanceSettings: {
      theme: 'light',
      language: 'id'
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      const settingsMap: Partial<Settings> = {};
      
      data?.forEach(item => {
        switch (item.setting_key) {
          case 'publishers':
            settingsMap.publishers = item.setting_value as string[];
            break;
          case 'publishing_targets':
            settingsMap.publishingTargets = item.setting_value as Settings['publishingTargets'];
            break;
          case 'acquisition_targets':
            settingsMap.acquisitionTargets = item.setting_value as Settings['acquisitionTargets'];
            break;
          case 'notification_settings':
            settingsMap.notificationSettings = item.setting_value as Settings['notificationSettings'];
            break;
          case 'appearance_settings':
            settingsMap.appearanceSettings = item.setting_value as Settings['appearanceSettings'];
            break;
        }
      });

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          setting_key: key,
          setting_value: value
        });

      if (error) {
        console.error('Error updating setting:', error);
        toast.error('Gagal menyimpan pengaturan');
        return false;
      }

      // Update local state
      switch (key) {
        case 'publishers':
          setSettings(prev => ({ ...prev, publishers: value }));
          break;
        case 'publishing_targets':
          setSettings(prev => ({ ...prev, publishingTargets: value }));
          break;
        case 'acquisition_targets':
          setSettings(prev => ({ ...prev, acquisitionTargets: value }));
          break;
        case 'notification_settings':
          setSettings(prev => ({ ...prev, notificationSettings: value }));
          break;
        case 'appearance_settings':
          setSettings(prev => ({ ...prev, appearanceSettings: value }));
          break;
      }

      toast.success('Pengaturan berhasil disimpan');
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Gagal menyimpan pengaturan');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    refreshSettings: fetchSettings
  };
}