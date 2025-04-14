import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarDetailsForm = ({ formData, setFormData, setStepValid }) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch storage locations
    fetchStorageLocations();
  }, []);
  
  // Validate step completion
  useEffect(() => {
    validateForm();
  }, [formData]);

  const fetchStorageLocations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:9000/api/v1/locations');
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching storage locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Required fields
    if (!formData.vinNumber?.trim()) newErrors.vinNumber = "VIN number is required";
    if (!formData.registrationNumber?.trim()) newErrors.registrationNumber = "Registration number is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.color?.trim()) newErrors.color = "Color is required";
    if (formData.mileage === undefined || formData.mileage === null) newErrors.mileage = "Mileage is required";
    if (formData.engineCapacity === undefined || formData.engineCapacity === null) newErrors.engineCapacity = "Engine capacity is required";
    if (!formData.purchaseDate) newErrors.purchaseDate = "Purchase date is required";
    if (formData.purchasePrice === undefined || formData.purchasePrice === null) newErrors.purchasePrice = "Purchase price is required";
    if (formData.sellingPrice === undefined || formData.sellingPrice === null) newErrors.sellingPrice = "Selling price is required";
    if (!formData.storageLocation?.id) newErrors.storageLocation = "Storage location is required";
    
    setErrors(newErrors);
    
    // Update step validation status
    setStepValid(Object.keys(newErrors).length === 0);
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

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VIN Number <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="vinNumber"
            value={formData.vinNumber || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.vinNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. 1FA6P8TH9L5123460"
            required
          />
          {errors.vinNumber && <p className="text-red-500 text-xs mt-1">{errors.vinNumber}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="registrationNumber"
            value={formData.registrationNumber || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. MUSTNG03"
            required
          />
          {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="year"
            value={formData.year || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="1900"
            max={new Date().getFullYear() + 1}
            required
          />
          {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="color"
            value={formData.color || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.color ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. Yellow"
            required
          />
          {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mileage (km) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="mileage"
            value={formData.mileage || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.mileage ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            step="0.01"
            required
          />
          {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engine Capacity (L) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="engineCapacity"
            value={formData.engineCapacity || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.engineCapacity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            step="0.01"
            required
          />
          {errors.engineCapacity && <p className="text-red-500 text-xs mt-1">{errors.engineCapacity}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Status <span className="text-red-500">*</span>
        </label>
        <select 
          name="currentStatus"
          value={formData.currentStatus || 'Available'}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date <span className="text-red-500">*</span>
          </label>
          <input 
            type="date" 
            name="purchaseDate"
            value={formData.purchaseDate || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.purchaseDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {errors.purchaseDate && <p className="text-red-500 text-xs mt-1">{errors.purchaseDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price ($) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="purchasePrice"
            value={formData.purchasePrice || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.purchasePrice ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            step="0.01"
            required
          />
          {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price ($) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            name="sellingPrice"
            value={formData.sellingPrice || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            min="0"
            step="0.01"
            required
          />
          {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Storage Location <span className="text-red-500">*</span>
        </label>
        <select 
          value={formData.storageLocation?.id || ''}
          onChange={handleLocationSelect}
          className={`w-full px-3 py-2 border ${errors.storageLocation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        >
          <option value="">Select Location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
        {errors.storageLocation && <p className="text-red-500 text-xs mt-1">{errors.storageLocation}</p>}
      </div>
    </div>
  );
};

export default CarDetailsForm;