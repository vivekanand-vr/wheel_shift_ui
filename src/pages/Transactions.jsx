import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import TransactionModal from '../components/transactions/TransactionModal.jsx';
import { DollarSign, Plus, Search, Filter, RefreshCw, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

const FinancialTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSales: 0,
    totalExpenses: 0
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fetch transactions with pagination
  const fetchTransactions = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:9000/api/v1/transactions/paged?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.content);
      setPagination({
        page: data.pageable.pageNumber,
        size: data.pageable.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch transaction statistics
  const fetchTransactionStats = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/transactions/statistics');
      if (!response.ok) {
        throw new Error('Failed to fetch transaction statistics');
      }
      const data = await response.json();
      setStats({
        totalPurchases: data.totalPurchases || 0,
        totalSales: data.totalSales || 0,
        totalExpenses: data.totalExpenses || 0
      });
    } catch (err) {
      console.error('Error fetching transaction statistics:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, []);

  // Fetch when search term changes (with debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTransactions(0, pagination.size);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle refresh
  const handleRefresh = () => {
    fetchTransactions(pagination.page, pagination.size);
    fetchTransactionStats();
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchTransactions(newPage, pagination.size);
  };

  // Open modal for adding a transaction
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  // Open modal for editing a transaction
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  // Handle transaction save (create or update)
  const handleSaveTransaction = async (transactionData) => {
    try {
      const url = transactionData.id 
        ? `/api/transactions/${transactionData.id}` 
        : '/api/transactions';
      
      const method = transactionData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }
      
      setModalOpen(false);
      handleRefresh();
    } catch (err) {
      console.error('Error saving transaction:', err);
      // You could set an error state here to display in the UI
    }
  };

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
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button 
            className="px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700 flex items-center"
            onClick={handleAddTransaction}
          >
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
              <p className="text-2xl font-bold">{formatAmount(stats.totalPurchases)}</p>
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
              <p className="text-2xl font-bold">{formatAmount(stats.totalSales)}</p>
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
              <p className="text-2xl font-bold">{formatAmount(stats.totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-purple-600 rounded-md text-sm font-medium text-white hover:bg-purple-700"
              onClick={handleRefresh}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <DollarSign size={20} className="text-purple-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.carDetails?.make} {transaction.carDetails?.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.carDetails?.year} | {transaction.carDetails?.vin}
                            </div>
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
                        <button 
                          className="text-purple-600 hover:text-purple-900 mr-3"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          Edit
                        </button>
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
            
            {transactions.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No transactions found matching your search criteria.</p>
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pagination.page * pagination.size + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalElements}</span> results
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className={`px-3 py-1 border rounded-md ${
                      pagination.page === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages).keys()].map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded-md ${
                        pagination.page === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages - 1}
                    className={`px-3 py-1 border rounded-md ${
                      pagination.page === pagination.totalPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Transaction Modal */}
      {modalOpen && (
        <TransactionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
        />
      )}
    </PageTemplate>
  );
};

export default FinancialTransactions;