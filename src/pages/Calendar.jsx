import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Calendar as CalendarIcon, 
  Car, 
  Users, 
  ClipboardList, 
  Briefcase, 
  Clock,
  Plus,
  RefreshCw
} from 'lucide-react';
import EventModal from '../components/calendar/EventModal.jsx';
import {
  fetchEventsByDateRange,
  fetchEventsSummary,
  createEvent,
  updateEvent,
  deleteEvent
} from '../api/calendarApi.js';

const Calendar = () => {
  // State
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weekSummary, setWeekSummary] = useState({
    totalAppointments: 0,
    countByType: {
      test_drive: 0,
      delivery: 0,
      inspection: 0,
      negotiation: 0,
      maintenance: 0
    }
  });
  const [calendarView, setCalendarView] = useState('timeGridWeek');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  
  // Refs
  const calendarRef = useRef(null);
  
  // Fetch events whenever date range changes
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchEvents();
    }
  }, [dateRange]);
  
  // Initial load
  useEffect(() => {
    const calendar = calendarRef.current;
    if (calendar) {
      const calendarApi = calendar.getApi();
      const view = calendarApi.view;
      
      handleDateRangeChange({
        start: view.activeStart,
        end: view.activeEnd
      });
    }
  }, []);
  
  // Fetch events based on current date range
  const fetchEvents = async () => {
    if (!dateRange.start || !dateRange.end) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEventsByDateRange(
        dateRange.start, 
        dateRange.end
      );
      
      // Transform data for FullCalendar if needed
      setEvents(data);
      
      // Fetch summary for current week
      await fetchWeekSummary();
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch weekly summary
  const fetchWeekSummary = async () => {
    try {
      // Get current week boundaries
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      
      const summary = await fetchEventsSummary(startOfWeek, endOfWeek);
      setWeekSummary(summary);
    } catch (err) {
      console.error('Error fetching week summary:', err);
    }
  };
  
  // Handle calendar view change
  const handleViewChange = (viewInfo) => {
    setCalendarView(viewInfo.view.type);
    
    // Update date range based on new view
    handleDateRangeChange({
      start: viewInfo.view.activeStart,
      end: viewInfo.view.activeEnd
    });
  };
  
  // Handle date range change (when navigating or changing view)
  const handleDateRangeChange = useCallback(({ start, end }) => {
    // Add a small buffer to ensure we get all events
    const bufferedStart = new Date(start);
    bufferedStart.setDate(bufferedStart.getDate() - 1);
    
    const bufferedEnd = new Date(end);
    bufferedEnd.setDate(bufferedEnd.getDate() + 1);
    
    setDateRange({
      start: bufferedStart,
      end: bufferedEnd
    });
  }, []);
  
  // Handle event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsCreatingEvent(false);
    setIsModalOpen(true);
  };
  
  // Handle date click - create new event
  const handleDateClick = (info) => {
    // Create a temporary event with some default values
    const defaultEndTime = new Date(info.date);
    defaultEndTime.setHours(defaultEndTime.getHours() + 1);
    
    setSelectedEvent({
      start: info.date,
      end: defaultEndTime,
      extendedProps: {
        type: 'TEST_DRIVE',
        customerName: '',
        carDetails: ''
      }
    });
    
    setIsCreatingEvent(true);
    setIsModalOpen(true);
  };
  
  // Close modal and reset selection
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  
  // Handle creating or updating an event
  const handleSaveEvent = async (eventData) => {
    try {
      if (eventData.id) {
        // Update existing event
        await updateEvent(eventData.id, eventData);
      } else {
        // Create new event
        await createEvent(eventData);
      }
      
      // Refresh events and summary
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Error saving event:', err);
      throw err;
    }
  };
  
  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      
      // Refresh events and summary
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };
  
  // Manually refresh data
  const handleRefresh = () => {
    fetchEvents();
  };
  
  // Show "Add Event" modal
  const handleAddEventClick = () => {
    setSelectedEvent(null);
    setIsCreatingEvent(true);
    setIsModalOpen(true);
  };
  
  // Get icon based on event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'test_drive':
        return <Car size={20} className="text-indigo-600" />;
      case 'inspection':
        return <ClipboardList size={20} className="text-orange-600" />;
      case 'delivery':
        return <Car size={20} className="text-teal-600" />;
      case 'negotiation':
        return <Briefcase size={20} className="text-violet-600" />;
      case 'maintenance':
        return <ClipboardList size={20} className="text-orange-600" />;
      default:
        return <CalendarIcon size={20} className="text-gray-600" />;
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate time difference in hours and minutes
  const getEventDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <PageTemplate title="Calendar">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main calendar area - takes 3/4 of the space on large screens */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="mb-4 border-b pb-4 flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center">
                <CalendarIcon size={20} className="text-purple-500 mr-2" />
                Dealership Events Calendar
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handleRefresh}
                  className="p-2 text-gray-600 hover:text-purple-600 rounded"
                  title="Refresh calendar"
                >
                  <RefreshCw size={18} />
                </button>
                <button 
                  onClick={handleAddEventClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  Add Event
                </button>
              </div>
            </div>
            {loading && !events.length && (
              <div className="text-center py-4 text-gray-500">
                Loading events...
              </div>
            )}
            {error && (
              <div className="text-center py-4 text-red-500">
                {error}
              </div>
            )}
            <div className="fc-calendar-container">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                selectable={true}
                editable={true}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
                  startTime: '09:00',
                  endTime: '18:00'
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                height="auto"
                eventDisplay="block"
                eventContent={(eventInfo) => {
                  return (
                    <div className="p-1 h-full overflow-hidden">
                      <div className="text-xs font-semibold truncate">
                        {eventInfo.event.title}
                      </div>
                      {eventInfo.view.type !== 'dayGridMonth' && (
                        <div className="text-xs mt-1 truncate">
                          {eventInfo.event.extendedProps?.customerName}
                        </div>
                      )}
                    </div>
                  );
                }}
                datesSet={(dateInfo) => {
                  handleDateRangeChange({
                    start: dateInfo.start,
                    end: dateInfo.end
                  });
                }}
                viewDidMount={handleViewChange}
              />
            </div>
          </div>
        </div>
        
        {/* Side panel - takes 1/4 of the space on large screens */}
        <div className="lg:col-span-1 space-y-6">
          {/* Today's schedule */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <CalendarIcon size={18} className="text-blue-500 mr-2" />
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {events
                .filter(event => {
                  const eventDate = new Date(event.start);
                  const today = new Date();
                  return (
                    eventDate.getDate() === today.getDate() &&
                    eventDate.getMonth() === today.getMonth() &&
                    eventDate.getFullYear() === today.getFullYear()
                  );
                })
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .map(event => (
                  <div 
                    key={event.id} 
                    className="p-2 border-l-4 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                    style={{ borderLeftColor: event.borderColor || '#6366f1' }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsCreatingEvent(false);
                      setIsModalOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        {getEventTypeIcon(event.extendedProps?.type)}
                        <span className="text-sm font-medium ml-2">{event.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getEventDuration(event.start, event.end)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.extendedProps?.customerName && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Users size={14} className="mr-1" />
                        {event.extendedProps.customerName}
                      </div>
                    )}
                    {event.extendedProps?.carDetails && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Car size={14} className="mr-1" />
                        {event.extendedProps.carDetails}
                      </div>
                    )}
                  </div>
                ))}
              {events.filter(event => {
                const eventDate = new Date(event.start);
                const today = new Date();
                return (
                  eventDate.getDate() === today.getDate() &&
                  eventDate.getMonth() === today.getMonth() &&
                  eventDate.getFullYear() === today.getFullYear()
                );
              }).length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No events scheduled for today
                </div>
              )}
            </div>
          </div>
          
          {/* Weekly Summary */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <ClipboardList size={18} className="text-purple-500 mr-2" />
              Weekly Summary
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">Total Events</div>
                <div className="text-2xl font-bold text-purple-700">
                  {weekSummary.totalAppointments}
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">Test Drives</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {weekSummary.countByType.test_drive ? weekSummary.countByType.test_drive : 0 }
                </div>
              </div>
              
              <div className="bg-teal-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">Deliveries</div>
                <div className="text-2xl font-bold text-teal-600">
                  {weekSummary.countByType.delivery ? weekSummary.countByType.delivery : 0}
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">Inspections</div>
                <div className="text-2xl font-bold text-orange-600">
                  {
                    (weekSummary.countByType.inspection ? weekSummary.countByType.inspection : 0) + 
                    (weekSummary.countByType.maintenance ? weekSummary.countByType.maintenance : 0)
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleAddEventClick}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Schedule New Appointment
              </button>
              <button 
                onClick={handleRefresh}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </PageTemplate>
  );
};

export default Calendar;