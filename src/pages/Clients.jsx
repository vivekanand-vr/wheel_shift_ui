import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate';
import ClientModal from '../components/manageClients/ClientModal';
import ClientFilter from '../components/manageClients/ClientFilter';
import { Users, Plus, Search, Filter, RefreshCw, Mail, Phone, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState({});
  const [filterApplied, setFilterApplied] = useState(false);
  
  // Stats
  const [activeClients, setActiveClients] = useState(0);
  const [repeatClients, setRepeatClients] = useState(0);

  // Fetch clients from API with filters
  const fetchClients = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build base URL with pagination
      let url = `http://localhost:9000/api/clients/search?page=${page}&size=${pageSize}`;
      
      // Add search term if present
      if (searchTerm) {
        url += `&searchText=${encodeURIComponent(searchTerm)}`;
      }
      
      // Add active filters
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      const response = await axios.get(url);
      const { content, totalElements, totalPages: pages, number } = response.data;
      
      setClients(content);
      setTotalClients(totalElements);
      setTotalPages(pages);
      setCurrentPage(number);
      
      // Calculate stats
      const active = content.filter(c => c.status === 'Active').length;
      const repeat = content.filter(c => c.totalPurchases > 1).length;
      
      // If we're on the first page, update the stats
      if (page === 0) {
        // For complete stats, we might need separate API calls
        // const statsUrl = 'http://localhost:9000/api/clients/stats';
        try {
          // const statsResponse = await axios.get(statsUrl);
          // setActiveClients(statsResponse.data.activeClientsCount);
          // setRepeatClients(statsResponse.data.repeatClientsCount);
          setActiveClients(1);
          setRepeatClients(1);
        } catch (statsErr) {
          console.error('Error fetching stats:', statsErr);
          setActiveClients(active);
          setRepeatClients(repeat);
        }
      } else {
        setActiveClients(active);
        setRepeatClients(repeat);
      }
      
    } catch (err) {
      setError('Failed to fetch clients. Please try again.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchClients(0);
  };

  // Handle filter application
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setFilterApplied(Object.values(filters).some(value => value !== null && value !== ''));
    setIsFilterModalOpen(false);
    setCurrentPage(0);
    fetchClients(0);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchClients(page);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchClients(currentPage);
  };

  // Open filter modal
  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  // Open modal for adding a new client
  const handleAddClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing client
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Handle successful client creation/update
  const handleClientSuccess = () => {
    // Refresh the client list
    fetchClients(currentPage);
  };

  // Load clients on component mount and when filters change
  useEffect(() => {
    fetchClients(0);
  }, []);

  return (
    <PageTemplate title="Client Management">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </form>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            onClick={handleOpenFilterModal}
            className={`px-4 py-2 border rounded-md text-sm font-medium flex items-center
              ${filterApplied 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <Filter size={16} className="mr-2" />
            {filterApplied ? 'Filters Applied' : 'Filter'}
          </button>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center"
            onClick={handleAddClient}
          >
            <Plus size={16} className="mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold">{totalClients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Clients</p>
              <p className="text-2xl font-bold">{activeClients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Repeat Clients</p>
              <p className="text-2xl font-bold">{repeatClients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary (if any) */}
      {filterApplied && (
        <div className="mb-4 bg-blue-50 border border-blue-100 rounded-md p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">Active Filters:</span>
            <button 
              onClick={() => {
                setActiveFilters({});
                setFilterApplied(false);
                setCurrentPage(0);
                fetchClients(0);
              }}
              className="text-sm text-blue-700 hover:text-blue-900"
            >
              Clear All
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (value !== null && value !== '') {
                let displayKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
                
                return (
                  <span key={key} className="inline-flex items-center bg-white border border-blue-200 rounded px-2 py-1 text-xs text-blue-700">
                    {displayKey}: {value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 mt-2">Loading clients...</p>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">Customer #{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Total: {customer.totalPurchases}</div>
                    <div className="text-sm text-gray-500">
                      {customer.lastPurchase 
                        ? `Last: ${new Date(customer.lastPurchase).toLocaleDateString()}`
                        : 'No purchases yet'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3 flex items-center justify-end"
                      onClick={() => handleEditClient(customer)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {!loading && clients.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No clients found matching your search criteria.</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{clients.length > 0 ? currentPage * pageSize + 1 : 0}</span> to{' '}
                    <span className="font-medium">
                      {Math.min((currentPage + 1) * pageSize, totalClients)}
                    </span>{' '}
                    of <span className="font-medium">{totalClients}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((number) => {
                      // Show first page, last page, and pages around current page
                      if (
                        number === 0 ||
                        number === totalPages - 1 ||
                        (number >= currentPage - 1 && number <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {number + 1}
                          </button>
                        );
                      } else if (
                        number === currentPage - 2 ||
                        number === currentPage + 2
                      ) {
                        // Show ellipsis for page gaps
                        return (
                          <span
                            key={number}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={selectedClient}
        onSuccess={handleClientSuccess}
      />

      {/* Filter Modal */}
      <ClientFilter
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </PageTemplate>
  );
};

export default Clients;