import { useState } from 'react';
import { Plus, Users, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AddTeamMemberModal } from '@/components/team/AddTeamMemberModal';
import { EditTeamMemberModal } from '@/components/team/EditTeamMemberModal';
import { DeleteTeamMemberDialog } from '@/components/team/DeleteTeamMemberDialog';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { TeamMember } from '@/types';
import { useTeamMembers } from '@/hooks/useSupabaseData';

export default function Team() {
  const { teamMembers, loading, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  const handleAddMember = async (newMember: TeamMember) => {
    await addTeamMember(newMember);
    setIsAddModalOpen(false);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (updatedMember: TeamMember) => {
    await updateTeamMember(updatedMember.id, updatedMember);
    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setDeletingMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!deletingMember) return;
    await deleteTeamMember(deletingMember.id);
    setIsDeleteDialogOpen(false);
    setDeletingMember(null);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Manajer': 'bg-primary/10 text-primary border-primary/20',
      'Produksi': 'bg-accent/10 text-accent border-accent/20',
      'Renebook': 'bg-success/10 text-success border-success/20',
      'Turos Pustaka': 'bg-warning/10 text-warning border-warning/20',
      'Reneluv': 'bg-error/10 text-error border-error/20',
      'Renekids': 'bg-purple-100 text-purple-700 border-purple-200',
      'Milestone': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[role as keyof typeof colors] || 'bg-muted/10 text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Memuat data tim...</div>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard menuItem="Tim">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Tim</h1>
          <p className="text-muted-foreground">Kelola anggota tim dan peran mereka</p>
        </div>
        <Button className="bg-gradient-primary shadow-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Anggota
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-3">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <Badge variant="outline" className={getRoleColor(member.role)}>
                {member.role}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditMember(member)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-error hover:bg-error/10" onClick={() => handleDeleteMember(member)}>
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddTeamMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddMember={handleAddMember} 
      />

      <EditTeamMemberModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
        }} 
        onUpdateMember={handleUpdateMember} 
        member={editingMember} 
      />

      <DeleteTeamMemberDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingMember(null);
        }} 
        onConfirm={confirmDeleteMember} 
        member={deletingMember} 
      />
      </div>
    </RoleGuard>
  );
}