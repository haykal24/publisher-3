import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleAccess {
  canAccessMenu: (menuItem: string) => boolean;
  canManageTeam: boolean;
  canAccessSettings: boolean;
  canViewAllData: boolean;
  userPublisher: string | null;
  isManager: boolean;
  isProduction: boolean;
  isPublisher: boolean;
}

export function useRoleAccess(): RoleAccess {
  const { profile } = useAuth();

  return useMemo(() => {
    const role = profile?.role || '';
    
    const isManager = role === 'Manajer';
    const isProduction = role === 'Produksi';
    const isPublisher = ['Renebook', 'Turos Pustaka', 'Rene Islam', 'Reneluv', 'Renekids', 'Milestone'].includes(role);
    
    const publisherRoles = ['Renebook', 'Turos Pustaka', 'Rene Islam', 'Reneluv', 'Renekids', 'Milestone'];
    const userPublisher = publisherRoles.includes(role) ? role : null;

    const canAccessMenu = (menuItem: string): boolean => {
      // Manager can access everything
      if (isManager) return true;
      
      // Production cannot access Team and Settings
      if (isProduction) {
        return !['Tim', 'Pengaturan'].includes(menuItem);
      }
      
      // Publisher roles cannot access Team
      if (isPublisher) {
        return menuItem !== 'Tim';
      }
      
      return false;
    };

    return {
      canAccessMenu,
      canManageTeam: isManager,
      canAccessSettings: isManager || isPublisher,
      canViewAllData: isManager || isProduction,
      userPublisher,
      isManager,
      isProduction,
      isPublisher,
    };
  }, [profile?.role]);
}