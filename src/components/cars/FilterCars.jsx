import React, { useState, useEffect } from 'react';

const FilterCars = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
  // State to hold filter values
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    bodyType: '',
    fuelType: '',
    transmissionType: '',
    color: '',
    yearFrom: null,
    yearTo: null,
    minPrice: null,
    maxPrice: null,
    minMileage: null,
    maxMileage: null,
    status: '',
    locationId: null,
    purchaseDateFrom: null,
    purchaseDateTo: null
  });

  // Update local state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Common options for select fields
  const makeOptions = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Volkswagen'];
  const bodyTypeOptions = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Convertible', 'Van'];
  const fuelTypeOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissionOptions = ['Automatic', 'Manual', 'Semi-automatic'];
  const statusOptions = ['Available', 'Sold', 'Reserved', 'In Service'];
  const colorOptions = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Grey', 'Green', 'Brown', 'Yellow', 'Orange'];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle numeric input changes
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? null : Number(value)
    }));
  };

  // Handle date input changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || null
    }));
  };

  // Reset all filters
  const handleClear = () => {
    setFilters({
      make: '',
      model: '',
      bodyType: '',
      fuelType: '',
      transmissionType: '',
      color: '',
      yearFrom: null,
      yearTo: null,
      minPrice: null,
      maxPrice: null,
      minMileage: null,
      maxMileage: null,
      status: '',
      locationId: null,
      purchaseDateFrom: null,
      purchaseDateTo: null
    });
  };

  // Apply filters and close modal
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-90vh overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Filter Vehicles</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium mb-1">Make</label>
              <select
                name="make"
                value={filters.make || ''}
                onChange={handleChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              >
                <option value="">Any Make</option>
                {makeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={filters.model || ''}
                onChange={handleChange}
                placeholder="Any Model"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Body Type</label>
              <select
                name="bodyType"
                value={filters.bodyType || ''}
                onChange={handleChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              >
                <option value="">Any Body Type</option>
                {bodyTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select
                name="fuelType"
                value={filters.fuelType || ''}
                onChange={handleChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              >
                <option value="">Any Fuel Type</option>
                {fuelTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Transmission Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select
                name="transmissionType"
                value={filters.transmissionType || ''}
                onChange={handleChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              >
                <option value="">Any Transmission</option>
                {transmissionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <select
                name="color"
                value={filters.color || ''}
                onChange={handleChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              >
                <option value="">Any Color</option>
                {colorOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Year From</label>
              <input
                type="number"
                name="yearFrom"
                value={filters.yearFrom || ''}
                onChange={handleNumericChange}
                placeholder="Min Year"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year To</label>
              <input
                type="number"
                name="yearTo"
                value={filters.yearTo || ''}
                onChange={handleNumericChange}
                placeholder="Max Year"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleNumericChange}
                placeholder="Min Price"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleNumericChange}
                placeholder="Max Price"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>

            {/* Mileage Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Min Mileage</label>
              <input
                type="number"
                name="minMileage"
                value={filters.minMileage || ''}
                onChange={handleNumericChange}
                placeholder="Min Mileage"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Mileage</label>
              <input
                type="number"
                name="maxMileage"
                value={filters.maxMileage || ''}
                onChange={handleNumericChange}
                placeholder="Max Mileage"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={filters.status || ''}
                onChange={handleChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              >
                <option value="">Any Status</option>
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Location ID */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="number"
                name="locationId"
                value={filters.locationId || ''}
                onChange={handleNumericChange}
                placeholder="Location ID"
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>

            {/* Purchase Date Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date From</label>
              <input
                type="date"
                name="purchaseDateFrom"
                value={filters.purchaseDateFrom || ''}
                onChange={handleDateChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date To</label>
              <input
                type="date"
                name="purchaseDateTo"
                value={filters.purchaseDateTo || ''}
                onChange={handleDateChange}
                className="w-full p-2 border border-1 border-gray-400 rounded"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Clear All
            </button>
            <button 
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCars;