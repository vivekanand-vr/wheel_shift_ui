import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import { Users, Plus, Search, Filter, RefreshCw, Mail, Phone, Eye } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample customers data
  const customers = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 123-4567', location: 'New York, NY', status: 'Active', totalPurchases: 2, lastPurchase: '2025-02-15' },
    { id: 2, name: 'Emily Johnson', email: 'emily.j@example.com', phone: '(555) 234-5678', location: 'Los Angeles, CA', status: 'Active', totalPurchases: 1, lastPurchase: '2025-01-20' },
    { id: 3, name: 'Michael Brown', email: 'michael.b@example.com', phone: '(555) 345-6789', location: 'Chicago, IL', status: 'Inactive', totalPurchases: 0, lastPurchase: null },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '(555) 456-7890', location: 'Houston, TX', status: 'Active', totalPurchases: 3, lastPurchase: '2025-03-05' },
    { id: 5, name: 'David Miller', email: 'david.m@example.com', phone: '(555) 567-8901', location: 'Phoenix, AZ', status: 'Active', totalPurchases: 1, lastPurchase: '2024-12-10' },
    { id: 6, name: 'Jennifer Davis', email: 'jennifer.d@example.com', phone: '(555) 678-9012', location: 'Philadelphia, PA', status: 'Active', totalPurchases: 2, lastPurchase: '2025-02-28' },
    { id: 7, name: 'Robert Wilson', email: 'robert.w@example.com', phone: '(555) 789-0123', location: 'San Antonio, TX', status: 'Inactive', totalPurchases: 1, lastPurchase: '2024-09-15' },
    { id: 8, name: 'Lisa Martinez', email: 'lisa.m@example.com', phone: '(555) 890-1234', location: 'San Diego, CA', status: 'Active', totalPurchases: 1, lastPurchase: '2025-01-05' },
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTemplate title="Customer Management">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
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
          <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center">
            <Plus size={16} className="mr-2" />
            Add Customer
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
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold">{customers.filter(c => c.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Repeat Customers</p>
              <p className="text-2xl font-bold">{customers.filter(c => c.totalPurchases > 1).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
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
              {filteredCustomers.map((customer) => (
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
                    <button className="text-blue-600 hover:text-blue-900 mr-3 flex items-center justify-end">
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No customers found matching your search criteria.</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Customers;