import React, { useState } from 'react';
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
  Clock 
} from 'lucide-react';

const Calendar = () => {
  // Sample events data
  const events = [
    {
      id: '1',
      title: 'Test Drive - Michael Brown',
      start: '2025-03-12T14:30:00',
      end: '2025-03-12T15:30:00',
      backgroundColor: '#818cf8', // indigo
      borderColor: '#6366f1',
      extendedProps: {
        type: 'test_drive',
        customerName: 'Michael Brown',
        carDetails: '2023 Toyota Camry'
      }
    },
    {
      id: '2',
      title: 'Inspection - Sarah Williams',
      start: '2025-03-12T16:00:00',
      end: '2025-03-12T17:00:00',
      backgroundColor: '#f97316', // orange
      borderColor: '#ea580c',
      extendedProps: {
        type: 'inspection',
        customerName: 'Sarah Williams',
        carDetails: '2022 Honda CR-V'
      }
    },
    {
      id: '3',
      title: 'Delivery - Robert Johnson',
      start: '2025-03-13T10:00:00',
      end: '2025-03-13T11:30:00',
      backgroundColor: '#14b8a6', // teal
      borderColor: '#0d9488',
      extendedProps: {
        type: 'delivery',
        customerName: 'Robert Johnson',
        carDetails: '2021 Lexus ES'
      }
    },
    {
      id: '4',
      title: 'Negotiation - Emily Davis',
      start: '2025-03-13T13:30:00',
      end: '2025-03-13T14:30:00',
      backgroundColor: '#8b5cf6', // violet
      borderColor: '#7c3aed',
      extendedProps: {
        type: 'negotiation',
        customerName: 'Emily Davis',
        carDetails: '2023 Ford Mustang'
      }
    },
    {
      id: '5',
      title: 'Test Drive - James Wilson',
      start: '2025-03-14T11:00:00',
      end: '2025-03-14T12:00:00',
      backgroundColor: '#818cf8', // indigo
      borderColor: '#6366f1',
      extendedProps: {
        type: 'test_drive',
        customerName: 'James Wilson',
        carDetails: '2022 BMW 3 Series'
      }
    },
    {
      id: '6',
      title: 'Vehicle Pickup - Lisa Taylor',
      start: '2025-03-15T09:30:00',
      end: '2025-03-15T10:30:00',
      backgroundColor: '#14b8a6', // teal
      borderColor: '#0d9488',
      extendedProps: {
        type: 'delivery',
        customerName: 'Lisa Taylor',
        carDetails: '2021 Audi Q5'
      }
    },
    {
      id: '7',
      title: 'Maintenance - David Clark',
      start: '2025-03-16T13:00:00',
      end: '2025-03-16T15:00:00',
      backgroundColor: '#f97316', // orange
      borderColor: '#ea580c',
      extendedProps: {
        type: 'maintenance',
        customerName: 'David Clark',
        carDetails: '2020 Tesla Model 3'
      }
    }
  ];

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handle event click
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  // Handle close event details
  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
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
            <div className="mb-4 border-b pb-4">
              <h2 className="font-semibold text-lg flex items-center">
                <CalendarIcon size={20} className="text-purple-500 mr-2" />
                Dealership Events Calendar
              </h2>
            </div>
            <div className="fc-calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                aspectRatio={1.8}
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
                  startTime: '09:00',
                  endTime: '18:00',
                }}
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
              />
            </div>
          </div>
        </div>

        {/* Right sidebar - takes 1/4 of the space on large screens */}
        <div className="lg:col-span-1">
          {/* Event details card, visible when an event is selected */}
          {selectedEvent ? (
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  {getEventTypeIcon(selectedEvent.extendedProps.type)}
                  <span className="ml-2 capitalize">
                    {selectedEvent.extendedProps.type.replace('_', ' ')} Details
                  </span>
                </h3>
                <button 
                  onClick={handleCloseEventDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <div className="flex items-center">
                    <Users size={16} className="text-gray-400 mr-2" />
                    <p className="font-medium">{selectedEvent.extendedProps.customerName}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                  <div className="flex items-center">
                    <Car size={16} className="text-gray-400 mr-2" />
                    <p className="font-medium">{selectedEvent.extendedProps.carDetails}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="text-gray-400 mr-2" />
                    <p className="font-medium">{formatDate(selectedEvent.start)}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <p className="font-medium">{getEventDuration(selectedEvent.start, selectedEvent.end)}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t">
                <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition duration-150 text-sm font-medium">
                  Edit Event
                </button>
              </div>
            </div>
          ) : null}

          {/* Event types legend card */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold">Event Types</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 mr-3"></div>
                  <span className="text-sm">Test Drive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-3"></div>
                  <span className="text-sm">Inspection/Maintenance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-teal-500 mr-3"></div>
                  <span className="text-sm">Delivery/Pickup</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-violet-500 mr-3"></div>
                  <span className="text-sm">Negotiation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats card */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold">This Week's Summary</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Appointments</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Test Drives</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deliveries</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Inspections</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Negotiations</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Calendar;