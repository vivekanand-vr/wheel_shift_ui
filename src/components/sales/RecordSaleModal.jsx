import React, { useState, useEffect } from 'react';
import { X, Car, DollarSign, Users, Calendar } from 'lucide-react';
import axios from 'axios';

const RecordSaleModal = ({ isOpen, onClose, onSaleRecorded }) => {
  const [availableCars, setAvailableCars] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [saleData, setSaleData] = useState({
    carId: '',
    clientId: '',
    employeeId: '',
    saleDate: new Date().toISOString().split('T')[0],
    salePrice: '',
    commissionRate: '5',
    paymentMethod: 'Cash',
    notes: ''
  });

  // Fetch available cars, clients and employees when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableCars();
      fetchClients();
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchAvailableCars = async () => {
    setLoading(true);
    try {
      // Assuming you have an endpoint to fetch cars with status="Available"
      const response = await axios.get('http://localhost:9000/api/cars/available');
      setAvailableCars(response.data);
    } catch (error) {
      console.error('Error fetching available cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleData({
      ...saleData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/api/sales', saleData);
      onSaleRecorded(response.data);
      onClose();
    } catch (error) {
      console.error('Error recording sale:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Record New Sale</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  name="carId"
                  value={saleData.carId}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {availableCars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.year} {car.make} {car.model} - ${car.listPrice}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  name="clientId"
                  value={saleData.clientId}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} - {client.email}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Employee Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salesperson
                </label>
                <select
                  name="employeeId"
                  value={saleData.employeeId}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a salesperson</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sale Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Date
                  </label>
                  <input
                    type="date"
                    name="saleDate"
                    value={saleData.saleDate}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="salePrice"
                      value={saleData.salePrice}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    name="commissionRate"
                    value={saleData.commissionRate}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={saleData.paymentMethod}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Finance">Finance</option>
                    <option value="Lease">Lease</option>
                  </select>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={saleData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Additional sale details..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Record Sale
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecordSaleModal;