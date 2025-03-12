import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { Calendar, Plus, Search, Filter, RefreshCw, Clock, DollarSign, AlertTriangle } from 'lucide-react';

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample reservations data based on Reservation.java model
  const reservations = [
    { 
      id: 1, 
      carId: 2, 
      carDetails: { make: 'Honda', model: 'Accord', year: 2021 }, 
      customerName: 'James Parker', 
      customerEmail: 'jparker@email.com', 
      customerPhone: '555-111-2222', 
      reservationDate: '2025-03-15T14:00:00',
      expiryDate: '2025-03-22T14:00:00',
      status: 'Active',
      depositAmount: 500.00,
      depositPaid: true,
      notes: 'Customer is interested in financing options',
      createdAt: '2025-03-10T11:30:00',
      updatedAt: '2025-03-10T11:30:00'
    },
    { 
      id: 2, 
      carId: 4, 
      carDetails: { make: 'Chevrolet', model: 'Equinox', year: 2023 }, 
      customerName: 'Melissa Grant', 
      customerEmail: 'mgrant@email.com', 
      customerPhone: '555-333-4444', 
      reservationDate: '2025-03-18T10:30:00',
      expiryDate: '2025-03-25T10:30:00',
      status: 'Pending',
      depositAmount: 750.00,
      depositPaid: false,
      notes: 'Awaiting deposit payment',
      createdAt: '2025-03-11T09:15:00',
      updatedAt: '2025-03-11T09:15:00'
    },
    { 
      id: 3, 
      carId: 6, 
      carDetails: { make: 'Mercedes-Benz', model: 'C-Class', year: 2022 }, 
      customerName: 'Kevin Mitchell', 
      customerEmail: 'kmitchell@email.com', 
      customerPhone: '555-555-6666', 
      reservationDate: '2025-03-12T16:00:00',
      expiryDate: '2025-03-19T16:00:00',
      status: 'Converted',
      depositAmount: 1000.00,
      depositPaid: true,
      notes: 'Customer has completed purchase',
      createdAt: '2025-03-05T14:45:00',
      updatedAt: '2025-03-12T17:30:00'
    },
    { 
      id: 4, 
      carId: 7, 
      carDetails: { make: 'Audi', model: 'A4', year: 2021 }, 
      customerName: 'Natalie Wong', 
      customerEmail: 'nwong@email.com', 
      customerPhone: '555-777-8888', 
      reservationDate: '2025-03-20T11:00:00',
      expiryDate: '2025-03-27T11:00:00',
      status: 'Active',
      depositAmount: 800.00,
      depositPaid: true,
      notes: 'Scheduled for test drive on 03/20',
      createdAt: '2025-03-10T10:20:00',
      updatedAt: '2025-03-10T15:45:00'
    },
    { 
      id: 5, 
      carId: 8, 
      carDetails: { make: 'Lexus', model: 'RX', year: 2022 }, 
      customerName: 'Thomas Garcia', 
      customerEmail: 'tgarcia@email.com', 
      customerPhone: '555-999-0000', 
      reservationDate: '2025-03-14T13:30:00',
      expiryDate: '2025-03-21T13:30:00',
      status: 'Expired',
      depositAmount: 600.00,
      depositPaid: true,
      notes: 'Customer did not complete purchase within timeframe',
      createdAt: '2025-03-07T16:10:00',
      updatedAt: '2025-03-21T13:30:00'
    },
  ];

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(reservation => 
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.carDetails.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.carDetails.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count reservations by status
  const activeReservations = reservations.filter(r => r.status === 'Active').length;
  const pendingReservations = reservations.filter(r => r.status === 'Pending').length;
  const expiringReservations = reservations.filter(r => {
    const expiryDate = new Date(r.expiryDate);
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return r.status === 'Active' && diffDays <= 3;
  }).length;

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Converted':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                        <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                        <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.carDetails.make} {reservation.carDetails.model}</div>
                    <div className="text-sm text-gray-500">{reservation.carDetails.year}</div>
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
                    <button className="text-purple-600 hover:text-purple-900 mr-3">Update</button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    {reservation.status === 'Active' && (
                      <button className="text-green-600 hover:text-green-900">Convert</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReservations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No reservations found matching your search criteria.</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Reservations;