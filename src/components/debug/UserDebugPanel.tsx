import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UserDebugPanel() {
  const { user, profile, loading } = useAuth();
  const { 
    isManager, 
    isProduction, 
    isPublisher, 
    canViewAllData, 
    canManageTeam, 
    canAccessSettings,
    userPublisher,
    canAccessMenu 
  } = useRoleAccess();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  const testMenuItems = ['Dashboard', 'Semua Buku', 'Bank Naskah', 'Analitik', 'Target', 'Kalender', 'Tim', 'Pengaturan'];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Debug: User Authentication & Permissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">User Info:</h4>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>

        <div>
          <h4 className="font-semibold">Profile Info:</h4>
          <p>Full Name: {profile?.full_name || 'N/A'}</p>
          <p>Role: <Badge variant="outline">{profile?.role || 'N/A'}</Badge></p>
        </div>

        <div>
          <h4 className="font-semibold">Role Checks:</h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={isManager ? "default" : "secondary"}>
              Manager: {isManager ? 'YES' : 'NO'}
            </Badge>
            <Badge variant={isProduction ? "default" : "secondary"}>
              Production: {isProduction ? 'YES' : 'NO'}
            </Badge>
            <Badge variant={isPublisher ? "default" : "secondary"}>
              Publisher: {isPublisher ? 'YES' : 'NO'}
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Permissions:</h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={canViewAllData ? "default" : "secondary"}>
              View All Data: {canViewAllData ? 'YES' : 'NO'}
            </Badge>
            <Badge variant={canManageTeam ? "default" : "secondary"}>
              Manage Team: {canManageTeam ? 'YES' : 'NO'}
            </Badge>
            <Badge variant={canAccessSettings ? "default" : "secondary"}>
              Access Settings: {canAccessSettings ? 'YES' : 'NO'}
            </Badge>
          </div>
          {userPublisher && <p>User Publisher: <Badge>{userPublisher}</Badge></p>}
        </div>

        <div>
          <h4 className="font-semibold">Menu Access:</h4>
          <div className="grid grid-cols-2 gap-2">
            {testMenuItems.map(menuItem => (
              <div key={menuItem} className="flex justify-between items-center">
                <span className="text-sm">{menuItem}:</span>
                <Badge variant={canAccessMenu(menuItem) ? "default" : "destructive"}>
                  {canAccessMenu(menuItem) ? 'ALLOWED' : 'DENIED'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}