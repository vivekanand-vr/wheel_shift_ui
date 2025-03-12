import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { Plus, Search, Filter, RefreshCw, Warehouse, Car, Phone, MapPin } from 'lucide-react';

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample storage locations data based on StorageLocation.java model
  const storageLocations = [
    { 
      id: 1, 
      name: 'Downtown Storage Facility',
      address: '123 Main Street, Downtown, NY 10001',
      contactPerson: 'Michael Brown',
      contactNumber: '555-123-4567',
      totalCapacity: 50,
      currentVehicleCount: 32,
      cars: [
        { id: 2, make: 'Honda', model: 'Accord', year: 2021 },
        { id: 4, make: 'Chevrolet', model: 'Equinox', year: 2023 },
        // ...other cars
      ]
    },
    { 
      id: 2, 
      name: 'Westside Garage',
      address: '456 West Avenue, Westside, NY 10002',
      contactPerson: 'Jennifer Lopez',
      contactNumber: '555-234-5678',
      totalCapacity: 30,
      currentVehicleCount: 18,
      cars: [
        { id: 6, make: 'Mercedes-Benz', model: 'C-Class', year: 2022 },
        // ...other cars
      ]
    },
    { 
      id: 3, 
      name: 'Southside Warehouse',
      address: '789 South Blvd, Southside, NY 10003',
      contactPerson: 'Robert Johnson',
      contactNumber: '555-345-6789',
      totalCapacity: 80,
      currentVehicleCount: 65,
      cars: [
        { id: 7, make: 'Audi', model: 'A4', year: 2021 },
        { id: 8, make: 'Lexus', model: 'RX', year: 2022 },
        // ...other cars
      ]
    },
    { 
      id: 4, 
      name: 'East End Storage',
      address: '101 East End Road, Eastside, NY 10004',
      contactPerson: 'Sarah Williams',
      contactNumber: '555-456-7890',
      totalCapacity: 40,
      currentVehicleCount: 22,
      cars: [
        // ...cars
      ]
    },
    { 
      id: 5, 
      name: 'North County Parking',
      address: '202 North County Road, Northside, NY 10005',
      contactPerson: 'David Miller',
      contactNumber: '555-567-8901',
      totalCapacity: 60,
      currentVehicleCount: 45,
      cars: [
        // ...cars
      ]
    },
  ];

  // Filter storage locations based on search term
  const filteredLocations = storageLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate storage stats
  const totalCapacity = storageLocations.reduce((sum, location) => sum + location.totalCapacity, 0);
  const totalVehicles = storageLocations.reduce((sum, location) => sum + location.currentVehicleCount, 0);
  const availableSpace = totalCapacity - totalVehicles;

  // Function to calculate usage percentage
  const calculateUsagePercentage = (current, total) => {
    return Math.round((current / total) * 100);
  };

  // Function to get capacity status color
  const getCapacityStatusColor = (percentage) => {
    if (percentage < 60) return 'text-green-600';
    if (percentage < 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <PageTemplate title="Storage Locations">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search locations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700 flex items-center">
            <Plus size={16} className="mr-2" />
            Add Location
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Warehouse size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Locations</p>
              <p className="text-2xl font-bold">{storageLocations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Car size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stored Vehicles</p>
              <p className="text-2xl font-bold">{totalVehicles} / {totalCapacity}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <MapPin size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Space</p>
              <p className="text-2xl font-bold">{availableSpace} spots</p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Locations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => {
          const usagePercentage = calculateUsagePercentage(location.currentVehicleCount, location.totalCapacity);
          const statusColorClass = getCapacityStatusColor(usagePercentage);
          
          return (
            <div key={location.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                  <div className={`text-sm font-bold ${statusColorClass}`}>
                    {usagePercentage}% Full
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-start mb-3">
                    <MapPin size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Phone size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      {location.contactPerson} | {location.contactNumber}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Car size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      {location.currentVehicleCount} / {location.totalCapacity} vehicles
                    </p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${
                      usagePercentage < 60 ? 'bg-green-500' : 
                      usagePercentage < 85 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-between mt-2">
                  <button className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                    View Details
                  </button>
                  <button className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Vehicle List
                  </button>
                  <button className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredLocations.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Warehouse size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No storage locations found matching your search criteria.</p>
        </div>
      )}
    </PageTemplate>
  );
};

export default Locations;