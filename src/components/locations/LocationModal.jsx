import React from 'react'
import axios from 'axios';
import { Trash } from 'lucide-react';

const LocationModal = ({ isOpen, onClose, currentLocation,  formData, setFormData, refresh }) => {
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalCapacity' ? parseInt(value, 10) || 0 : value
    });
  };

  // Save location (create or update)
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    
    try {
      if (currentLocation) {
        // Update existing location
        await axios.put(`http://localhost:9000/api/v1/locations/${currentLocation.id}`, formData);
      } else {
        // Create new location
        await axios.post('http://localhost:9000/api/v1/locations', formData);
      }
      
      // Refresh the locations list
      refresh();
      onClose();
    } catch (err) {
      console.error('Error saving location:', err);
      alert('Failed to save location. Please try again.');
    }
  };

  // Delete location
  const handleDeleteLocation = async () => {
    if (!currentLocation) return;
    
    if (window.confirm(`Are you sure you want to delete ${currentLocation.name}?`)) {
      try {
        await axios.delete(`http://localhost:9000/api/v1/locations/${currentLocation.id}`);
        refresh();
        onClose();
      } catch (err) {
        console.error('Error deleting location:', err);
        alert('Failed to delete location. Please try again.');
      }
    }
  };

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-90 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {currentLocation ? 'Edit Location' : 'Add New Location'}
        </h2>
        
        <form onSubmit={handleSaveLocation}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Capacity
            </label>
            <input
              type="number"
              name="totalCapacity"
              value={formData.totalCapacity}
              onChange={handleInputChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <div>
              {currentLocation && (
                <button
                  type="button"
                  onClick={handleDeleteLocation}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium flex items-center"
                >
                  <Trash size={16} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
              >
                {currentLocation ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LocationModal