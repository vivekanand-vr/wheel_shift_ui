import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { DollarSign, Plus, Search, Filter, RefreshCw, FileText, BarChart2 } from 'lucide-react';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample sales data based on Sale.java model
  const sales = [
    { id: 1, carId: 3, carDetails: { make: 'Ford', model: 'Mustang', year: 2020 }, buyerName: 'John Smith', buyerContact: 'john.smith@email.com', saleDate: '2025-02-15', salePrice: 34500, commissionRate: 2.5, totalCommission: 862.50, paymentMethod: 'Finance' },
    { id: 2, carId: 5, carDetails: { make: 'BMW', model: '3 Series', year: 2021 }, buyerName: 'Amanda Johnson', buyerContact: 'amanda.j@email.com', saleDate: '2025-02-20', salePrice: 40800, commissionRate: 2.5, totalCommission: 1020.00, paymentMethod: 'Cash' },
    { id: 3, carId: 9, carDetails: { make: 'Audi', model: 'Q5', year: 2022 }, buyerName: 'Michael Chen', buyerContact: 'mchen@email.com', saleDate: '2025-02-28', salePrice: 47500, commissionRate: 3.0, totalCommission: 1425.00, paymentMethod: 'Finance' },
    { id: 4, carId: 11, carDetails: { make: 'Tesla', model: 'Model Y', year: 2023 }, buyerName: 'Sarah Williams', buyerContact: 'swilliams@email.com', saleDate: '2025-03-05', salePrice: 52000, commissionRate: 2.0, totalCommission: 1040.00, paymentMethod: 'Bank Transfer' },
    { id: 5, carId: 14, carDetails: { make: 'Lexus', model: 'ES', year: 2021 }, buyerName: 'David Thompson', buyerContact: 'dthompson@email.com', saleDate: '2025-03-10', salePrice: 39500, commissionRate: 2.5, totalCommission: 987.50, paymentMethod: 'Finance' },
  ];

  // Current month's total
  const currentMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.saleDate);
    const currentDate = new Date();
    return saleDate.getMonth() === currentDate.getMonth() && 
           saleDate.getFullYear() === currentDate.getFullYear();
  });

  const currentMonthTotal = currentMonthSales.reduce((total, sale) => total + sale.salePrice, 0);
  const currentMonthCommission = currentMonthSales.reduce((total, sale) => total + sale.totalCommission, 0);

  // Filter sales based on search term
  const filteredSales = sales.filter(sale => 
    sale.carDetails.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.carDetails.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.saleDate.includes(searchTerm)
  );

  return (
    <PageTemplate title="Sales Management">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sales..."
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
          <button className="px-4 py-2 bg-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700 flex items-center">
            <Plus size={16} className="mr-2" />
            Record Sale
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{sales.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <BarChart2 size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold">${currentMonthTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FileText size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Commission</p>
              <p className="text-2xl font-bold">${currentMonthCommission.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <DollarSign size={20} className="text-green-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {sale.carDetails.make} {sale.carDetails.model}
                        </div>
                        <div className="text-sm text-gray-500">{sale.carDetails.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.saleDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.buyerName}</div>
                    <div className="text-sm text-gray-500">{sale.buyerContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${sale.salePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${sale.totalCommission.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{sale.commissionRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' :
                        sale.paymentMethod === 'Finance' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'}`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSales.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No sales found matching your search criteria.</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Sales;