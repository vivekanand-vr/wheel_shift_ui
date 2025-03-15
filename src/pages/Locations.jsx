import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { Plus, Search, Filter, RefreshCw, Warehouse, Car, Phone, MapPin, Edit as EditIcon, Trash } from 'lucide-react';
import axios from 'axios';
import LocationModal from '../components/manageLocations/LocationModal.jsx';

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [storageLocations, setStorageLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactPerson: '',
    contactNumber: '',
    totalCapacity: 0
  });
  
  // Stats calculation
  const totalCapacity = storageLocations.reduce((sum, location) => sum + location.totalCapacity, 0);
  const totalVehicles = storageLocations.reduce((sum, location) => sum + location.currentVehicleCount, 0);
  const availableSpace = totalCapacity - totalVehicles;

  // Fetch locations data from API
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/api/v1/locations');
      setStorageLocations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load storage locations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter storage locations based on search term
  const filteredLocations = storageLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to calculate usage percentage
  const calculateUsagePercentage = (current, total) => {
    return Math.round((current / total) * 100) || 0;
  };

  // Function to get capacity status color
  const getCapacityStatusColor = (percentage) => {
    if (percentage < 60) return 'text-green-600';
    if (percentage < 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to get progress bar color
  const getProgressBarColor = (percentage) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

   // Open modal for editing existing location
   const handleEditLocation = (location) => {
    setCurrentLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      contactPerson: location.contactPerson,
      contactNumber: location.contactNumber,
      totalCapacity: location.totalCapacity
    });
    setShowModal(true);
  };

  // Open modal for adding new location
  const handleAddLocation = () => {
    setCurrentLocation(null);
    setFormData({
      name: '',
      address: '',
      contactPerson: '',
      contactNumber: '',
      totalCapacity: 0
    });
    setShowModal(true);
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
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={fetchLocations}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button 
            className="px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700 flex items-center"
            onClick={handleAddLocation}
          >
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

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading storage locations...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="text-center py-10 bg-white rounded-lg shadow border-l-4 border-red-500">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchLocations}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Storage Locations Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => {
            const usagePercentage = calculateUsagePercentage(location.currentVehicleCount, location.totalCapacity);
            const statusColorClass = getCapacityStatusColor(usagePercentage);
            const progressBarColor = getProgressBarColor(usagePercentage);
            
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
                      className={`h-2.5 rounded-full ${progressBarColor}`} 
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
                    <button 
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      onClick={() => handleEditLocation(location)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!loading && !error && filteredLocations.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <Warehouse size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No storage locations found matching your search criteria.</p>
        </div>
      )}

      {/* Add/Edit Location Modal */}
      <LocationModal isOpen={showModal}
                     onClose={() => setShowModal(false)}
                     currentLocation={currentLocation} 
                     formData={formData} 
                     setFormData={setFormData}
                     refresh={fetchLocations} 
      />
    
    </PageTemplate>
  );
};

export default Locations;