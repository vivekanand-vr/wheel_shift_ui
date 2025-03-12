import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { DollarSign, Plus, Search, Filter, RefreshCw, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

const FinancialTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample financial transactions data based on FinancialTransaction.java model
  const transactions = [
    { 
      id: 1, 
      carId: 2, 
      carDetails: { make: 'Honda', model: 'Accord', year: 2021, vin: 'JH2PC35G1MM200020' }, 
      transactionType: 'Purchase',
      amount: 21500.00,
      transactionDate: '2025-03-05',
      description: 'Initial purchase of vehicle from auction',
      vendorName: 'City Auto Auction',
      receiptUrl: '/receipts/purchase-21500-20250305.pdf',
      createdAt: '2025-03-05T10:30:00'
    },
    { 
      id: 2, 
      carId: 2, 
      carDetails: { make: 'Honda', model: 'Accord', year: 2021, vin: 'JH2PC35G1MM200020' }, 
      transactionType: 'Repair',
      amount: 850.00,
      transactionDate: '2025-03-07',
      description: 'Brake system repair and fluid replacement',
      vendorName: 'QuickFix Auto Service',
      receiptUrl: '/receipts/repair-850-20250307.pdf',
      createdAt: '2025-03-07T15:45:00'
    },
    { 
      id: 3, 
      carId: 4, 
      carDetails: { make: 'Chevrolet', model: 'Equinox', year: 2023, vin: '2GNFLFEK8D6417982' }, 
      transactionType: 'Purchase',
      amount: 28750.00,
      transactionDate: '2025-03-10',
      description: 'Vehicle purchase from trade-in',
      vendorName: 'DirectSale Motors',
      receiptUrl: '/receipts/purchase-28750-20250310.pdf',
      createdAt: '2025-03-10T09:15:00'
    },
    { 
      id: 4, 
      carId: 4, 
      carDetails: { make: 'Chevrolet', model: 'Equinox', year: 2023, vin: '2GNFLFEK8D6417982' }, 
      transactionType: 'Detailing',
      amount: 350.00,
      transactionDate: '2025-03-11',
      description: 'Full interior and exterior detailing',
      vendorName: 'Premium Auto Detailing',
      receiptUrl: '/receipts/detail-350-20250311.pdf',
      createdAt: '2025-03-11T13:20:00'
    },
    { 
      id: 5, 
      carId: 6, 
      carDetails: { make: 'Mercedes-Benz', model: 'C-Class', year: 2022, vin: 'WDDWF4KB2GR157998' }, 
      transactionType: 'Sale',
      amount: 39500.00,
      transactionDate: '2025-03-12',
      description: 'Vehicle sale to customer Kevin Mitchell',
      vendorName: null,
      receiptUrl: '/receipts/sale-39500-20250312.pdf',
      createdAt: '2025-03-12T17:30:00'
    },
  ];

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.carDetails.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.carDetails.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.vendorName && transaction.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate transaction stats
  const totalPurchases = transactions
    .filter(t => t.transactionType === 'Purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSales = transactions
    .filter(t => t.transactionType === 'Sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.transactionType !== 'Purchase' && t.transactionType !== 'Sale')
    .reduce((sum, t) => sum + t.amount, 0);

  // Function to format amount
  const formatAmount = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to get transaction type badge style
  const getTransactionTypeStyle = (type) => {
    switch(type) {
      case 'Purchase':
        return 'bg-blue-100 text-blue-800';
      case 'Sale':
        return 'bg-green-100 text-green-800';
      case 'Repair':
        return 'bg-orange-100 text-orange-800';
      case 'Detailing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get amount style based on transaction type
  const getAmountStyle = (type) => {
    switch(type) {
      case 'Purchase':
      case 'Repair':
      case 'Detailing':
        return 'text-red-600';
      case 'Sale':
        return 'text-green-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <PageTemplate title="Financial Transactions">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
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
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <TrendingDown size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Purchases</p>
              <p className="text-2xl font-bold">{formatAmount(totalPurchases)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{formatAmount(totalSales)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <DollarSign size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">{formatAmount(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor/Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <DollarSign size={20} className="text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.carDetails.make} {transaction.carDetails.model}</div>
                        <div className="text-sm text-gray-500">{transaction.carDetails.year} | {transaction.carDetails.vin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeStyle(transaction.transactionType)}`}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.transactionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${getAmountStyle(transaction.transactionType)}`}>
                      {formatAmount(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.vendorName || 'N/A'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 mr-3">Edit</button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    {transaction.receiptUrl && (
                      <button className="text-green-600 hover:text-green-900 items-center inline-flex">
                        <Receipt size={16} className="mr-1" />
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No transactions found matching your search criteria.</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default FinancialTransactions;