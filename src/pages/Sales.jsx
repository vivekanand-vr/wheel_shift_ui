import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { DollarSign, Plus, Search, Filter, RefreshCw, FileText, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import RecordSaleModal from '../components/sales/RecordSaleModal.jsx';
import FilterModal from '../components/sales/FilterModal.jsx';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [recordSaleModalOpen, setRecordSaleModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Stats
  const [monthlyStat, setMonthlyStat] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCommission: 0
  });

  // Fetch sales data
  const fetchSales = async (pageNum = page, pageSize = size, searchQuery = searchTerm) => {
    setLoading(true);
    try {
      let url = `http://localhost:9000/api/sales/paged?page=${pageNum}&size=${pageSize}&sortBy=saleDate&direction=desc`;
      
      // Add search parameter if provided
      if (searchQuery) {
        url = `http://localhost:9000/api/sales/search?searchTerm=${searchQuery}&page=${pageNum}&size=${pageSize}`;
      }
      
      const response = await axios.get(url);
      setSales(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalElements);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Failed to load sales data. Please try again later.');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly statistics
  const fetchMonthlyStats = async () => {
    try {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      // Get total monthly revenue
      const revenueResponse = await axios.get(`http://localhost:9000/api/sales/statistics/total-amount?startDate=${firstDay}&endDate=${lastDay}`);
      
      // Get total monthly commission
      const commissionResponse = await axios.get(`http://localhost:9000/api/sales/statistics/total-commission?startDate=${firstDay}&endDate=${lastDay}`);
      
      // Count monthly sales (assuming we don't have a dedicated endpoint for this)
      const salesInCurrentMonth = await axios.get(`http://localhost:9000/api/sales/search/date-range?startDate=${firstDay}&endDate=${lastDay}`);
      
      setMonthlyStat({
        totalSales: salesInCurrentMonth.data.length,
        totalRevenue: revenueResponse.data,
        totalCommission: commissionResponse.data
      });
    } catch (err) {
      console.error('Error fetching monthly statistics:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSales();
    fetchMonthlyStats();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchSales(newPage, size, searchTerm);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page
    fetchSales(0, size, searchTerm);
  };

  // Handle Filters Application
  const handleFilterApplied = (filteredSales, totalPgs, totalItems) => {
    setSales(filteredSales);
    setTotalPages(totalPgs);
    setTotalItems(totalItems);
  };
  
  // Handle New Sale Creation
  const handleSaleRecorded = (newSale) => {
    // Refresh the sales data
    fetchSales();
    fetchMonthlyStats();
  };

  // Handle refresh
  const handleRefresh = () => {
    setSearchTerm('');
    setPage(0);
    fetchSales(0, size, '');
    fetchMonthlyStats();
  };

  return (
    <PageTemplate title="Sales Management">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
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
        </form>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => setFilterModalOpen(true)}
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
            className="px-4 py-2 bg-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700 flex items-center"
            onClick={() => setRecordSaleModalOpen(true)}
          >
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
              <p className="text-2xl font-bold">{monthlyStat.totalSales}</p>
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
              <p className="text-2xl font-bold">${monthlyStat.totalRevenue?.toLocaleString() || '0'}</p>
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
              <p className="text-2xl font-bold">${monthlyStat.totalCommission?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
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
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <DollarSign size={20} className="text-green-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sale.carMake} {sale.carModel}
                          </div>
                          <div className="text-sm text-gray-500">{sale.carYear}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sale.clientName}</div>
                      <div className="text-sm text-gray-500">{sale.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${parseFloat(sale.salePrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${parseFloat(sale.totalCommission).toLocaleString()}</div>
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
        )}
        
        {!loading && sales.length === 0 && !error && (
          <div className="text-center py-10">
            <p className="text-gray-500">No sales found matching your search criteria.</p>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${page === 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages - 1}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${page === totalPages - 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{sales.length === 0 ? 0 : page * size + 1}</span> to <span className="font-medium">{Math.min((page + 1) * size, totalItems)}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${page === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(Math.min(5, totalPages)).keys()].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx;
                    } else if (page < 3) {
                      pageNum = idx;
                    } else if (page > totalPages - 3) {
                      pageNum = totalPages - 5 + idx;
                    } else {
                      pageNum = page - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === pageNum
                            ? 'bg-blue-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${page === totalPages - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Modal */}
      <FilterModal 
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onFilterApplied={handleFilterApplied}
      />

      {/* Record Sale Modal */}
      <RecordSaleModal
        isOpen={recordSaleModalOpen}
        onClose={() => setRecordSaleModalOpen(false)}
        onSaleRecorded={handleSaleRecorded}
      />
    </PageTemplate>
  );
};

export default Sales;