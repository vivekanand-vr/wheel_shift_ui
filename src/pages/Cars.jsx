import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import FilterModal from '../components/cars/FilterCars.jsx';
import { Car, Plus, Search, Filter, RefreshCw } from 'lucide-react';
import axios from 'axios';
import AddEditCar from '../components/cars/AddEditCar.jsx';
import { useNavigate } from 'react-router-dom';

const Cars = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCarFormModal, setShowCarFormModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filter criteria state (will be passed to the filter modal)
  const [filterCriteria, setFilterCriteria] = useState({
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
    purchaseDateTo: null,
    searchText: ''
  });

  // Function to fetch cars data
  const fetchCars = async (page = currentPage, size = pageSize, criteria = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `http://localhost:9000/api/v1/cars/basic-details/paged?page=${page}&size=${size}`;
      let response;
      
      // If there are filter criteria, use the search endpoint
      if (criteria) {
        response = await axios.post('http://localhost:9000/api/v1/cars/filters', criteria, {
          params: { page, size }
        });
      } else if (searchTerm) {
        // If there's a simple search term, add it to the request
        response = await axios.get('http://localhost:9000/api/v1/cars/search', {
          params: { searchTerm, page, size }
        });
      } else {
        // Otherwise, just get all cars
        response = await axios.get(url);
      }
      
      const { content, totalPages, number, totalElements } = response.data;
      setVehicles(content);
      setTotalPages(totalPages);
      setCurrentPage(number);
      setTotalElements(totalElements);
      
    } catch (err) {
      console.error("Error fetching car data:", err);
      setError("Failed to load vehicles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCars();
  }, []);
  
  // Handle quick search
  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page
    fetchCars(0, pageSize, { searchText: searchTerm });
  };
  
  // Apply filters from the modal
  const applyFilters = (criteria) => {
    setFilterCriteria(criteria);
    setCurrentPage(0); // Reset to first page
    fetchCars(0, pageSize, criteria);
    setShowFilterModal(false);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCars(newPage, pageSize, searchTerm ? { searchText: searchTerm } : filterCriteria);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setFilterCriteria({
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
      purchaseDateTo: null,
    });
    fetchCars(0, pageSize);
  };

  function handleAddCar() {
    setSelectedCar(null); // Ensures new form data 
    setShowCarFormModal(true); 
  }

  function handleUpdateCar(car) { 
    setSelectedCar(car); 
    setShowCarFormModal(true); 
  }

  return (
    <PageTemplate title="Cars Management">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search vehicles..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center"
            onClick={handleAddCar} >
            <Plus size={16} className="mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Car size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-2xl font-bold">{totalElements}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Car size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.currentStatus === 'Available').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Car size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sold/Reserved</p>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.currentStatus !== 'Available').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal 
          isOpen={showFilterModal} 
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={applyFilters}
          initialFilters={filterCriteria}
        />
      )}

      {/* Add Car Modal */}
      {showCarFormModal && (
        <AddEditCar
          refresh={handleRefresh} 
          isOpen={showCarFormModal}
          onClose={() => setShowCarFormModal(false)}
        />
      )}

      {/* Update Car Modal */}
      {showCarFormModal && (
        <AddEditCar 
          refresh={handleRefresh}
          isOpen={showCarFormModal}
          onClose={() => setShowCarFormModal(false)}
          carToEdit={selectedCar}
        />
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading vehicles...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Cars Table */}
      {!loading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mileage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Body Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/cars/${vehicle.id}`)}>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Car size={20} className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.carModel.make} {vehicle.carModel.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vehicle.carModel.variant} • {vehicle.carModel.bodyType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.color}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.carModel.fuelType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.carModel.bodyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md 
                        ${vehicle.currentStatus === 'Available' ? 'bg-green-100 text-green-800' : 
                          vehicle.currentStatus === 'Sold' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {vehicle.currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => handleUpdateCar(vehicle)}
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {vehicles.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">No vehicles found matching your search criteria.</p>
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{vehicles.length > 0 ? currentPage * pageSize + 1 : 0}</span> to{" "}
                    <span className="font-medium">
                      {Math.min((currentPage + 1) * pageSize, totalElements)}
                    </span>{" "}
                    of <span className="font-medium">{totalElements}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page Numbers */}
                    {[...Array(totalPages).keys()].map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PageTemplate>
  );
};

export default Cars;