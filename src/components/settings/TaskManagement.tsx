import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Edit2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTasks } from '@/contexts/TasksContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function TaskManagement() {
  const { tasks, addTask, updateTask, deleteTask, moveTaskUp, moveTaskDown } = useTasks();
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTask, setEditingTask] = useState<{ id: string; name: string } | null>(null);

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      toast.error('Nama tugas tidak boleh kosong');
      return;
    }
    
    addTask(newTaskName.trim());
    setNewTaskName('');
    toast.success('Tugas berhasil ditambahkan');
  };

  const handleUpdateTask = () => {
    if (!editingTask || !editingTask.name.trim()) {
      toast.error('Nama tugas tidak boleh kosong');
      return;
    }
    
    updateTask(editingTask.id, editingTask.name.trim());
    setEditingTask(null);
    toast.success('Tugas berhasil diperbarui');
  };

  const handleDeleteTask = (id: string, name: string) => {
    deleteTask(id);
    toast.success(`Tugas "${name}" berhasil dihapus`);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Kelola tugas dan tahapan produksi buku. Anda dapat menambah, mengedit, menghapus, dan mengubah urutan tahapan.
        Pengaturan ini tersinkron dengan kartu buku pada menu Dashboard dan Semua Buku.
      </p>
      
      {/* Add New Task */}
      <div className="space-y-2">
        <Label htmlFor="new-task">Tambah Tugas Baru</Label>
        <div className="flex gap-2">
          <Input
            id="new-task"
            placeholder="Nama tugas baru"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button onClick={handleAddTask}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
            <div className="flex items-center gap-3 flex-1">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              
              {editingTask?.id === task.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingTask.name}
                    onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleUpdateTask}>
                    Simpan
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setEditingTask(null)}
                  >
                    Batal
                  </Button>
                </div>
              ) : (
                <span className="flex-1">{task.name}</span>
              )}
            </div>
            
            {!editingTask && (
              <div className="flex gap-1">
                {/* Move Up/Down Buttons */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveTaskUp(index)}
                  disabled={index === 0}
                  className="p-2"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveTaskDown(index)}
                  disabled={index === tasks.length - 1}
                  className="p-2"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {/* Edit Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTask({ id: task.id, name: task.name })}
                  className="p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                
                {/* Delete Button with Confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Tugas</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus tugas "{task.name}"? 
                        Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi semua buku yang menggunakan tugas ini.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTask(task.id, task.name)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}