import React, { useState, useEffect } from 'react';
import { X, Receipt } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    carId: '',
    transactionType: 'Purchase',
    amount: '',
    transactionDate: new Date().toISOString().slice(0, 10),
    description: '',
    vendorName: '',
    receiptUrl: null
  });
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [fileUpload, setFileUpload] = useState(null);

  // Transaction types
  const transactionTypes = ['Purchase', 'Sale', 'Repair', 'Detailing', 'Inspection', 'Other'];
  
  // Fetch cars for selection
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    
    fetchCars();
  }, []);
  
  // Set form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        id: transaction.id || null,
        carId: transaction.carId || '',
        transactionType: transaction.transactionType || 'Purchase',
        amount: transaction.amount || '',
        transactionDate: transaction.transactionDate || new Date().toISOString().slice(0, 10),
        description: transaction.description || '',
        vendorName: transaction.vendorName || '',
        receiptUrl: transaction.receiptUrl || null
      });
    } else {
      // Reset form for new transaction
      setFormData({
        id: null,
        carId: '',
        transactionType: 'Purchase',
        amount: '',
        transactionDate: new Date().toISOString().slice(0, 10),
        description: '',
        vendorName: '',
        receiptUrl: null
      });
    }
  }, [transaction]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.carId) errors.carId = 'Vehicle is required';
    if (!formData.transactionType) errors.transactionType = 'Transaction type is required';
    if (!formData.amount) errors.amount = 'Amount is required';
    if (!formData.transactionDate) errors.transactionDate = 'Date is required';
    if (!formData.description) errors.description = 'Description is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // If there's a file to upload, handle that first
      if (fileUpload) {
        const formData = new FormData();
        formData.append('file', fileUpload);
        
        const uploadResponse = await fetch('/api/upload/receipt', {
          method: 'POST',
          body: formData
        });
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          setFormData(prev => ({
            ...prev,
            receiptUrl: url
          }));
        }
      }
      
      // Then save the transaction
      onSave(formData);
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle <span className="text-red-500">*</span>
              </label>
              <select
                name="carId"
                value={formData.carId}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  validationErrors.carId ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              >
                <option value="">Select a vehicle</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year}) - {car.vin}
                  </option>
                ))}
              </select>
              {validationErrors.carId && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.carId}</p>
              )}
            </div>
            
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  validationErrors.transactionType ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              >
                {transactionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {validationErrors.transactionType && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.transactionType}</p>
              )}
            </div>
            
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`block w-full pl-8 pr-3 py-2 border ${
                    validationErrors.amount ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  placeholder="0.00"
                />
              </div>
              {validationErrors.amount && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.amount}</p>
              )}
            </div>
            
            {/* Transaction Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  validationErrors.transactionDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              />
              {validationErrors.transactionDate && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.transactionDate}</p>
              )}
            </div>
            
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Vendor or customer name"
              />
            </div>
            
            {/* Receipt Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receiptUpload"
                  accept="image/*,application/pdf"
                />
                <label
                  htmlFor="receiptUpload"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center"
                >
                  <Receipt size={16} className="mr-2" />
                  {fileUpload ? fileUpload.name : "Upload Receipt"}
                </label>
                {(formData.receiptUrl || fileUpload) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFileUpload(null);
                      setFormData(prev => ({ ...prev, receiptUrl: null }));
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              {formData.receiptUrl && !fileUpload && (
                <p className="mt-1 text-sm text-gray-500">
                  Current receipt: {formData.receiptUrl.split('/').pop()}
                </p>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`block w-full px-3 py-2 border ${
                validationErrors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              placeholder="Transaction details"
            ></textarea>
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save Transaction"} 
            </button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ); 
};

export default TransactionModal;