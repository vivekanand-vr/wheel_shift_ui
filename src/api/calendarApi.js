/**
 * Calendar API service
 * Handles all API calls related to calendar events
 */

// Base API URL - should be configured based on environment
const API_BASE_URL = 'http://localhost:9000/api/calendar';

// Fetch events for a specific date range
export const fetchEventsByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/range?start=${formatDateParam(startDate)}&end=${formatDateParam(endDate)}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }
};

// Fetch events for a specific month
export const fetchEventsByMonth = async (year, month) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/month?year=${year}&month=${month}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching monthly events: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events by month:', error);
    throw error;
  }
};

// Fetch events for a specific week
export const fetchEventsByWeek = async (startDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/week?startDate=${formatDateParam(startDate)}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching weekly events: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events by week:', error);
    throw error;
  }
};

// Fetch events for a specific day
export const fetchEventsByDay = async (date) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/day?date=${formatDateParam(date)}`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching daily events: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching events by day:', error);
    throw error;
  }
};

// Get events summary for a date range
export const fetchEventsSummary = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/summary?start=${formatDateParam(startDate)}&end=${formatDateParam(endDate)}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching events summary: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events summary:', error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating event: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  try {
    console.log(eventData);
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating event: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting event: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Helper function to format date for URL parameters (YYYY-MM-DD)
const formatDateParam = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};