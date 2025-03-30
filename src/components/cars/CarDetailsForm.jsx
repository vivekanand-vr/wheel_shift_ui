import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step2 = ({ formData, setFormData }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
     // Fetch storage locations
     fetchStorageLocations();
   }, []);
  
  const fetchStorageLocations = async () => {
    try {
      // Replace with actual API call
      const response = await axios.get('http://localhost:9000/api/v1/locations');
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching storage locations:", error);
    }
  };

  const handleLocationSelect = (e) => {
    const locationId = parseInt(e.target.value);
    setFormData(prevData => ({
      ...prevData,
      storageLocation: { id: locationId }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">VIN Number</label>
          <input 
            type="text" 
            name="vinNumber"
            value={formData.vinNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 1FA6P8TH9L5123460"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
          <input 
            type="text" 
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. MUSTNG03"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input 
            type="number" 
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1900"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input 
            type="text" 
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Yellow"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
          <input 
            type="number" 
            name="mileage"
            value={formData.mileage}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity (L)</label>
          <input 
            type="number" 
            name="engineCapacity"
            value={formData.engineCapacity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
        <select 
          name="currentStatus"
          value={formData.currentStatus}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Reserved">Reserved</option>
          <option value="In Service">In Service</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input 
            type="date" 
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
          <input 
            type="number" 
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
          <input 
            type="number" 
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
        <select 
          onChange={handleLocationSelect}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Step2