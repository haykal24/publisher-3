import React from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
  menuItem?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback, 
  menuItem 
}: RoleGuardProps) {
  const { canAccessMenu, isManager, isProduction, isPublisher } = useRoleAccess();

  // Check menu access if menuItem is provided
  if (menuItem && !canAccessMenu(menuItem)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Anda tidak memiliki akses ke halaman ini. Hubungi administrator untuk informasi lebih lanjut.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check specific role requirements if allowedRoles is provided
  if (allowedRoles) {
    const hasAllowedRole = allowedRoles.some(role => {
      switch (role) {
        case 'Manajer':
          return isManager;
        case 'Produksi':
          return isProduction;
        case 'Publisher':
          return isPublisher;
        default:
          return false;
      }
    });

    if (!hasAllowedRole) {
      return fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Anda tidak memiliki izin untuk mengakses fitur ini.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  return <>{children}</>;
}