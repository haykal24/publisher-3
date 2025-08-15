import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TaskTemplate {
  id: string;
  name: string;
  order: number;
}

interface TasksContextType {
  tasks: TaskTemplate[];
  addTask: (name: string) => void;
  updateTask: (id: string, name: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (sourceIndex: number, destinationIndex: number) => void;
  moveTaskUp: (index: number) => void;
  moveTaskDown: (index: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const defaultTasks = [
  'Cover Design', 'Pengantar & Endors', 'Editing Naskah', 'Draf PK & Peta Buku', 
  'Layout', 'Desain Peta Buku', 'Print & Proofread Awal', 'QC Isi & ACC Kover Final',
  'Finishing Produksi', 'SPH', 'PK Final', 'Cetak Awal Dummy', 'Proofread Akhir',
  'Input Akhir', 'Cetak Dummy Digital Printing', 'Naik Cetak', 'Turun Cetak'
];

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskTemplate[]>(
    defaultTasks.map((name, index) => ({
      id: `task-${index + 1}`,
      name,
      order: index
    }))
  );

  const addTask = (name: string) => {
    const newTask: TaskTemplate = {
      id: `task-${Date.now()}`,
      name,
      order: tasks.length
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, name: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, name } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const filteredTasks = prev.filter(task => task.id !== id);
      return filteredTasks.map((task, index) => ({ ...task, order: index }));
    });
  };

  const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const [removed] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, removed);
      return newTasks.map((task, index) => ({ ...task, order: index }));
    });
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      reorderTasks(index, index - 1);
    }
  };

  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      reorderTasks(index, index + 1);
    }
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks,
      moveTaskUp,
      moveTaskDown
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}