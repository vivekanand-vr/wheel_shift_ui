import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { Calendar, Plus, Search, Filter, RefreshCw, Clock, DollarSign, AlertTriangle, Loader } from 'lucide-react';

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    status: [],
    depositPaid: null,
    dateRange: {
      start: null,
      end: null
    }
  });

  // Fetch reservations from API
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:9000/api/v1/reservations');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(reservation => 
    reservation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.car.carModel.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.car.carModel.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count reservations by status
  const activeReservations = reservations.filter(r => r.status === 'ACTIVE').length;
  const pendingReservations = reservations.filter(r => r.status === 'PENDING' || (r.status === 'ACTIVE' && !r.depositPaid)).length;
  const expiringReservations = reservations.filter(r => {
    const expiryDate = new Date(r.expiryDate);
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return r.status === 'ACTIVE' && diffDays <= 3;
  }).length;

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONVERTED':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to handle reservation update
  const handleUpdateReservation = (reservation) => {
    setCurrentReservation(reservation);
    setShowUpdateModal(true);
  };

  // Function to apply filter
  const applyFilter = () => {
    setShowFilterModal(false);
    // You would implement filtering logic here
  };

  // Reset filter
  const resetFilter = () => {
    setFilterOptions({
      status: [],
      depositPaid: null,
      dateRange: {
        start: null,
        end: null
      }
    });
    setShowFilterModal(false);
  };

  return (
    <PageTemplate title="Vehicle Reservations">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reservations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={fetchReservations}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700 flex items-center">
            <Plus size={16} className="mr-2" />
            Add Reservation
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Reservations</p>
              <p className="text-2xl font-bold">{activeReservations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Deposits</p>
              <p className="text-2xl font-bold">{pendingReservations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold">{expiringReservations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-500">Error: {error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700"
              onClick={fetchReservations}
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deposit
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
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Calendar size={20} className="text-purple-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{reservation.client.name}</div>
                          <div className="text-sm text-gray-500">{reservation.client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.car.carModel.make} {reservation.car.carModel.model}</div>
                      <div className="text-sm text-gray-500">{reservation.car.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reservation.reservationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reservation.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${reservation.depositAmount.toLocaleString()}</div>
                      <div className="text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.depositPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {reservation.depositPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-purple-600 hover:text-purple-900 mr-3"
                        onClick={() => handleUpdateReservation(reservation)}
                      >
                        Update
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      {reservation.status === 'ACTIVE' && (
                        <button className="text-green-600 hover:text-green-900">Convert</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && !error && filteredReservations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No reservations found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowFilterModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Filter Reservations</h3>
                    <div className="mt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-2 space-x-2">
                          {['ACTIVE', 'PENDING', 'CONVERTED', 'EXPIRED'].map(status => (
                            <label key={status} className="inline-flex items-center">
                              <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-purple-600"
                                checked={filterOptions.status.includes(status)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFilterOptions({
                                      ...filterOptions,
                                      status: [...filterOptions.status, status]
                                    });
                                  } else {
                                    setFilterOptions({
                                      ...filterOptions,
                                      status: filterOptions.status.filter(s => s !== status)
                                    });
                                  }
                                }}
                              />
                              <span className="ml-2 text-sm text-gray-700">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Deposit Status</label>
                        <div className="mt-2 space-x-4">
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio h-4 w-4 text-purple-600"
                              checked={filterOptions.depositPaid === true}
                              onChange={() => setFilterOptions({ ...filterOptions, depositPaid: true })}
                            />
                            <span className="ml-2 text-sm text-gray-700">Paid</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio h-4 w-4 text-purple-600"
                              checked={filterOptions.depositPaid === false}
                              onChange={() => setFilterOptions({ ...filterOptions, depositPaid: false })}
                            />
                            <span className="ml-2 text-sm text-gray-700">Unpaid</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio h-4 w-4 text-purple-600"
                              checked={filterOptions.depositPaid === null}
                              onChange={() => setFilterOptions({ ...filterOptions, depositPaid: null })}
                            />
                            <span className="ml-2 text-sm text-gray-700">All</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Date Range</label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500">Start Date</label>
                            <input 
                              type="date" 
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              value={filterOptions.dateRange.start || ''}
                              onChange={(e) => setFilterOptions({
                                ...filterOptions,
                                dateRange: {
                                  ...filterOptions.dateRange,
                                  start: e.target.value || null
                                }
                              })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500">End Date</label>
                            <input 
                              type="date" 
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                              value={filterOptions.dateRange.end || ''}
                              onChange={(e) => setFilterOptions({
                                ...filterOptions,
                                dateRange: {
                                  ...filterOptions.dateRange,
                                  end: e.target.value || null
                                }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={applyFilter}
                >
                  Apply Filter
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={resetFilter}
                >
                  Reset
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowFilterModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Reservation Modal */}
      {showUpdateModal && currentReservation && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowUpdateModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Update Reservation</h3>
                    <div className="mt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select 
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          defaultValue={currentReservation.status}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PENDING">PENDING</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="EXPIRED">EXPIRED</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          defaultValue={currentReservation.client.name}
                          readOnly
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                        <input 
                          type="text" 
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          defaultValue={`${currentReservation.car.carModel.make} ${currentReservation.car.carModel.model} ${currentReservation.car.year}`}
                          readOnly
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Deposit</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input 
                            type="number" 
                            className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            defaultValue={currentReservation.depositAmount}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Deposit Paid</label>
                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input 
                              type="checkbox" 
                              className="form-checkbox h-4 w-4 text-purple-600"
                              defaultChecked={currentReservation.depositPaid}
                            />
                            <span className="ml-2 text-sm text-gray-700">Paid</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea 
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                          rows="3"
                          defaultValue={currentReservation.notes}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default Reservations;