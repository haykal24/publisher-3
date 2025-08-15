import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { FullCalendarView } from '@/components/calendar/FullCalendarView';
import { sampleBooks } from '@/data/sampleData';
import { CalendarEvent } from '@/types';
import { useTasks } from '@/contexts/TasksContext';
export default function CalendarPage() {
  const {
    tasks
  } = useTasks();
  const [monthFilter, setMonthFilter] = useState('08');
  const [yearFilter, setYearFilter] = useState('2024');
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar events from book tasks
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    sampleBooks.forEach(book => {
      // Add book deadline as main event
      const getDeadlineStatus = () => {
        const today = new Date();
        const deadline = new Date(book.deadline);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (book.status === 'Done') return 'completed';
        if (diffDays <= 7) return 'near-deadline';
        return 'in-progress';
      };
      events.push({
        id: `book-${book.id}`,
        title: `Deadline: ${book.title}`,
        date: book.deadline,
        type: 'deadline',
        status: getDeadlineStatus(),
        bookId: book.id
      });

      // Add individual task deadlines
      book.tasks.forEach(task => {
        const getTaskStatus = () => {
          if (task.status === 'Done') return 'completed';
          const today = new Date();
          const deadline = new Date(task.deadline);
          const diffTime = deadline.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 3) return 'near-deadline';
          return 'in-progress';
        };
        events.push({
          id: `task-${task.id}`,
          title: `${task.name} - ${book.title.substring(0, 20)}...`,
          date: task.deadline,
          type: 'milestone',
          status: getTaskStatus(),
          bookId: book.id
        });
      });
    });
    return events;
  }, [tasks]);
  const months = [{
    value: '01',
    label: 'Januari'
  }, {
    value: '02',
    label: 'Februari'
  }, {
    value: '03',
    label: 'Maret'
  }, {
    value: '04',
    label: 'April'
  }, {
    value: '05',
    label: 'Mei'
  }, {
    value: '06',
    label: 'Juni'
  }, {
    value: '07',
    label: 'Juli'
  }, {
    value: '08',
    label: 'Agustus'
  }, {
    value: '09',
    label: 'September'
  }, {
    value: '10',
    label: 'Oktober'
  }, {
    value: '11',
    label: 'November'
  }, {
    value: '12',
    label: 'Desember'
  }];
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };
  const handleMonthYearChange = (month: string, year: string) => {
    const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    setCurrentDate(newDate);
  };
  const getDisplayTitle = () => {
    const monthName = months.find(m => m.value === monthFilter)?.label || 'Agustus';
    return `Kalender Deadline ${monthName} ${yearFilter}`;
  };
  return <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <h1 className="text-2xl font-bold"> Kalender Deadline</h1>
          
        </div>
        
        
      </div>

      <FullCalendarView events={calendarEvents} view={viewMode} currentDate={currentDate} />
    </div>;
}