import React, { useState } from 'react';
import { X } from 'lucide-react';

const ClientFilter = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    name: initialFilters.name || '',
    email: initialFilters.email || '',
    phone: initialFilters.phone || '',
    location: initialFilters.location || '',
    status: initialFilters.status || '',
    minTotalPurchases: initialFilters.minTotalPurchases || '',
    maxTotalPurchases: initialFilters.maxTotalPurchases || '',
    lastPurchaseFrom: initialFilters.lastPurchaseFrom || '',
    lastPurchaseTo: initialFilters.lastPurchaseTo || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert empty strings to null for backend processing
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value === '' ? null : value])
    );
    onApplyFilters(cleanedFilters);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      email: '',
      phone: '',
      location: '',
      status: '',
      minTotalPurchases: '',
      maxTotalPurchases: '',
      lastPurchaseFrom: '',
      lastPurchaseTo: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Filter Clients</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Details */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Client Details</h3>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={filters.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            {/* Purchase Information */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Purchase Information</h3>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Min Purchases</label>
              <input
                type="number"
                name="minTotalPurchases"
                min="0"
                value={filters.minTotalPurchases}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Max Purchases</label>
              <input
                type="number"
                name="maxTotalPurchases"
                min="0"
                value={filters.maxTotalPurchases}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Last Purchase From</label>
              <input
                type="date"
                name="lastPurchaseFrom"
                value={filters.lastPurchaseFrom}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Last Purchase To</label>
              <input
                type="date"
                name="lastPurchaseTo"
                value={filters.lastPurchaseTo}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFilter;