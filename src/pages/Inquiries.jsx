import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { MessageSquare, Plus, Search, Filter, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample inquiries data based on Inquiry.java model
  const inquiries = [
    { 
      id: 1, 
      carId: 1, 
      carDetails: { make: 'Toyota', model: 'Camry', year: 2022 }, 
      customerName: 'Emma Davis', 
      customerEmail: 'emma.davis@email.com', 
      customerPhone: '555-123-4567', 
      inquiryType: 'Test Drive',
      message: 'I would like to schedule a test drive for this Toyota Camry. Is it available this weekend?',
      status: 'New',
      assignedTo: null,
      response: null,
      responseDate: null,
      createdAt: '2025-03-10T14:25:30',
      updatedAt: '2025-03-10T14:25:30'
    },
    { 
      id: 2, 
      carId: 4, 
      carDetails: { make: 'Chevrolet', model: 'Equinox', year: 2023 }, 
      customerName: 'Robert Wilson', 
      customerEmail: 'rwilson@email.com', 
      customerPhone: '555-987-6543', 
      inquiryType: 'Price Inquiry',
      message: 'Is there any room for negotiation on the price? I\'m very interested in this SUV.',
      status: 'In Progress',
      assignedTo: { id: 3, name: 'Jane Cooper' },
      response: null,
      responseDate: null,
      createdAt: '2025-03-09T10:15:45',
      updatedAt: '2025-03-10T09:30:20'
    },
    { 
      id: 3, 
      carId: 6, 
      carDetails: { make: 'Mercedes-Benz', model: 'C-Class', year: 2022 }, 
      customerName: 'Sophia Martinez', 
      customerEmail: 'smartinez@email.com', 
      customerPhone: '555-456-7890', 
      inquiryType: 'Financing Options',
      message: 'What financing options do you have available for this C-Class? I\'m looking for a 48-month term if possible.',
      status: 'Resolved',
      assignedTo: { id: 2, name: 'Tom Harris' },
      response: 'We offer several financing options including a 48-month term at 3.9% APR. I\'ve attached a detailed breakdown for your review.',
      responseDate: '2025-03-09T15:45:30',
      createdAt: '2025-03-08T11:20:15',
      updatedAt: '2025-03-09T15:45:30'
    },
    { 
      id: 4, 
      carId: 7, 
      carDetails: { make: 'Audi', model: 'A4', year: 2021 }, 
      customerName: 'Daniel Brown', 
      customerEmail: 'dbrown@email.com', 
      customerPhone: '555-789-0123', 
      inquiryType: 'Vehicle History',
      message: 'Can you provide the full vehicle history report for this Audi A4? I\'d like to know about any accidents or major repairs.',
      status: 'New',
      assignedTo: null,
      response: null,
      responseDate: null,
      createdAt: '2025-03-10T16:40:00',
      updatedAt: '2025-03-10T16:40:00'
    },
    { 
      id: 5, 
      carId: 8, 
      carDetails: { make: 'Lexus', model: 'RX', year: 2022 }, 
      customerName: 'Olivia Johnson', 
      customerEmail: 'ojohnson@email.com', 
      customerPhone: '555-234-5678', 
      inquiryType: 'Trade-In',
      message: 'I\'m interested in trading in my 2018 Honda CR-V for this Lexus RX. Could you give me an estimate on my trade-in value?',
      status: 'In Progress',
      assignedTo: { id: 1, name: 'Mark Stevens' },
      response: null,
      responseDate: null,
      createdAt: '2025-03-09T13:30:45',
      updatedAt: '2025-03-10T10:15:30'
    },
  ];

  // Filter inquiries based on search term
  const filteredInquiries = inquiries.filter(inquiry => 
    inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.carDetails.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.carDetails.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.inquiryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count inquiries by status
  const newInquiries = inquiries.filter(i => i.status === 'New').length;
  const inProgressInquiries = inquiries.filter(i => i.status === 'In Progress').length;
  const resolvedInquiries = inquiries.filter(i => i.status === 'Resolved').length;

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'New':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageTemplate title="Customer Inquiries">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search inquiries..."
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
          <button className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 flex items-center">
            <Plus size={16} className="mr-2" />
            Add Inquiry
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <AlertCircle size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Inquiries</p>
              <p className="text-2xl font-bold">{newInquiries}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold">{inProgressInquiries}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold">{resolvedInquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <MessageSquare size={20} className="text-indigo-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{inquiry.customerName}</div>
                        <div className="text-sm text-gray-500">{inquiry.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inquiry.carDetails.make} {inquiry.carDetails.model}</div>
                    <div className="text-sm text-gray-500">{inquiry.carDetails.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.inquiryType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.assignedTo ? inquiry.assignedTo.name : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Respond</button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInquiries.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No inquiries found matching your search criteria.</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Inquiries;