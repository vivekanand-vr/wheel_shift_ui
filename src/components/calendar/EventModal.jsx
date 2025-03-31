import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Car, 
  Users, 
  Clock,
  Save,
  Trash2
} from 'lucide-react';

// Event colors mapping
const EVENT_COLORS = {
  'TEST_DRIVE': { bg: '#818cf8', border: '#6366f1' },
  'INSPECTION': { bg: '#f97316', border: '#ea580c' },
  'MAINTENANCE': { bg: '#f97316', border: '#ea580c' },
  'DELIVERY': { bg: '#14b8a6', border: '#0d9488' },
  'NEGOTIATION': { bg: '#8b5cf6', border: '#7c3aed' }
};

const EVENT_TYPE_MAPPING = {
  'test_drive': 'TEST_DRIVE',
  'inspection': 'INSPECTION',
  'delivery': 'DELIVERY',
  'negotiation': 'NEGOTIATION',
  'maintenance': 'MAINTENANCE'
};

const EventModal = ({ isOpen, onClose, event, onSave, onDelete }) => {
  const [eventData, setEventData] = useState({
    id: null,
    title: '',
    start: '',
    end: '',
    eventType: 'TEST_DRIVE',
    customerName: '',
    carDetails: '',
    backgroundColor: '',
    borderColor: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (event) {
      // Edit mode - populate form with existing event data
      setEventData({
        id: event.id || null,
        title: event.title || '',
        start: formatDateTimeForInput(event.start) || '',
        end: formatDateTimeForInput(event.end) || '',
        eventType: event.extendedProps?.type 
          ? EVENT_TYPE_MAPPING[event.extendedProps.type] || 'TEST_DRIVE' 
          : 'TEST_DRIVE',
        customerName: event.extendedProps?.customerName || '',
        carDetails: event.extendedProps?.carDetails || '',
        backgroundColor: event.backgroundColor || '',
        borderColor: event.borderColor || ''
      });
    } else {
      // Create mode - set default values
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      setEventData({
        id: null,
        title: '',
        start: formatDateTimeForInput(now),
        end: formatDateTimeForInput(oneHourLater),
        eventType: 'TEST_DRIVE',
        customerName: '',
        carDetails: '',
        backgroundColor: EVENT_COLORS['TEST_DRIVE'].bg,
        borderColor: EVENT_COLORS['TEST_DRIVE'].border
      });
    }
  }, [event, isOpen]);
  
  // Format date for datetime-local input
  const formatDateTimeForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'eventType') {
      const colors = EVENT_COLORS[value];
      setEventData({
        ...eventData,
        [name]: value,
        backgroundColor: colors.bg,
        borderColor: colors.border
      });
    } else {
      setEventData({
        ...eventData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };
  
  // Generate title based on event type and customer name
  const generateTitle = () => {
    if (!eventData.customerName) return;
    
    console.log(eventData.eventType);
    const eventTypeFormatted = eventData.eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const newTitle = `${eventTypeFormatted} - ${eventData.customerName}`;
    setEventData({...eventData, title: newTitle});
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) newErrors.title = 'Title is required';
    if (!eventData.start) newErrors.start = 'Start time is required';
    if (!eventData.end) newErrors.end = 'End time is required';
    if (!eventData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!eventData.carDetails.trim()) newErrors.carDetails = 'Car details are required';
    
    // Validate that end time is after start time
    if (eventData.start && eventData.end) {
      const startDate = new Date(eventData.start);
      const endDate = new Date(eventData.end);
      if (endDate <= startDate) {
        newErrors.end = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert dates to ISO format for API
      const formattedData = {
        ...eventData,
        start: new Date(eventData.start).toISOString(),
        end: new Date(eventData.end).toISOString()
      };
      
      await onSave(formattedData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({...errors, form: 'Failed to save event. Please try again.'});
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!eventData.id) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsSubmitting(true);
      try {
        await onDelete(eventData.id);
        onClose();
      } catch (error) {
        console.error('Error deleting event:', error);
        setErrors({...errors, form: 'Failed to delete event. Please try again.'});
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-semibold text-gray-800 text-lg">
            {eventData.id ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {errors.form && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-sm">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Event Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                name="eventType"
                value={eventData.eventType}
                onChange={handleChange}
                onBlur={generateTitle}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="TEST_DRIVE">Test Drive</option>
                <option value="INSPECTION">Inspection</option>
                <option value="DELIVERY">Delivery/Pickup</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="customerName"
                  value={eventData.customerName}
                  onChange={handleChange}
                  onBlur={generateTitle}
                  className={`w-full border ${errors.customerName ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Customer name"
                />
              </div>
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
              )}
            </div>
            
            {/* Car Details */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Car Details
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Car size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="carDetails"
                  value={eventData.carDetails}
                  onChange={handleChange}
                  className={`w-full border ${errors.carDetails ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Year Make Model"
                />
              </div>
              {errors.carDetails && (
                <p className="text-red-500 text-xs mt-1">{errors.carDetails}</p>
              )}
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className={`w-full border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Event title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="start"
                    value={eventData.start}
                    onChange={handleChange}
                    className={`w-full border ${errors.start ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {errors.start && (
                  <p className="text-red-500 text-xs mt-1">{errors.start}</p>
                )}
              </div>
              
              {/* End Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="end"
                    value={eventData.end}
                    onChange={handleChange}
                    className={`w-full border ${errors.end ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                {errors.end && (
                  <p className="text-red-500 text-xs mt-1">{errors.end}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {eventData.id && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            )}
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;