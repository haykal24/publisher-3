import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '@/types';
import { useState } from 'react';
import { EventDetailModal } from './EventDetailModal';

interface FullCalendarViewProps {
  events: CalendarEvent[];
  view: string;
  currentDate: Date;
}

export function FullCalendarView({ events, view, currentDate }: FullCalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEventColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // green
      case 'in-progress':
        return '#3b82f6'; // blue  
      case 'near-deadline':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    backgroundColor: getEventColor(event.status),
    borderColor: getEventColor(event.status),
    textColor: '#ffffff',
    extendedProps: {
      status: event.status,
      type: event.type,
      bookId: event.bookId
    }
  }));

  const handleEventClick = (info: any) => {
    const clickedEvent = events.find(e => e.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setIsModalOpen(true);
    }
  };

  const getCalendarView = () => {
    switch (view) {
      case 'day':
        return 'timeGridDay';
      case 'week':
        return 'timeGridWeek';
      case 'month':
      default:
        return 'dayGridMonth';
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <style>{`
        .fc {
          --fc-border-color: hsl(var(--border));
          --fc-button-text-color: hsl(var(--foreground));
          --fc-button-bg-color: hsl(var(--background));
          --fc-button-border-color: hsl(var(--border));
          --fc-button-hover-bg-color: hsl(var(--accent));
          --fc-button-active-bg-color: hsl(var(--primary));
          --fc-today-bg-color: hsl(var(--accent) / 0.1);
        }
        
        .fc-theme-standard .fc-scrollgrid {
          border-color: hsl(var(--border));
        }
        
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: hsl(var(--border));
        }
        
        .fc-daygrid-day-number, .fc-col-header-cell-cushion {
          color: hsl(var(--foreground));
        }
        
        .fc-button-primary {
          background-color: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        .fc-button-primary:hover {
          background-color: hsl(var(--primary) / 0.9) !important;
          border-color: hsl(var(--primary) / 0.9) !important;
        }
        
        .fc-event {
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .fc-event:hover {
          opacity: 0.8;
        }
        
        .fc-toolbar h2 {
          color: hsl(var(--foreground));
          font-size: 1.5rem;
          font-weight: 600;
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={getCalendarView()}
        initialDate={currentDate}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
        locale="id"
        buttonText={{
          today: 'Hari ini',
          month: 'Bulan',
          week: 'Minggu', 
          day: 'Hari',
          list: 'Daftar'
        }}
        dayHeaderFormat={{ weekday: 'short' }}
        eventDisplay="block"
        dayMaxEvents={3}
        moreLinkText="lainnya"
      />
      
      <EventDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}