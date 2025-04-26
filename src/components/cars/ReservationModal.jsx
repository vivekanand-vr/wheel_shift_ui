import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, User, DollarSign, Clock, FileText, AlertCircle } from 'lucide-react';

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  carId, 
  existingReservation = null, 
  onSuccess 
}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    clientId: '',
    reservationDate: new Date().toISOString().substr(0, 16),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 16),
    status: 'Pending',
    depositAmount: '',
    depositPaid: false,
    notes: ''
  });

  // Fetch clients when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchClients();
      
      // If editing an existing reservation, populate the form
      if (existingReservation) {
        setFormData({
          clientId: existingReservation.client.id,
          reservationDate: new Date(existingReservation.reservationDate).toISOString().substr(0, 16),
          expiryDate: new Date(existingReservation.expiryDate).toISOString().substr(0, 16),
          status: existingReservation.status,
          depositAmount: existingReservation.depositAmount || '',
          depositPaid: existingReservation.depositPaid || false,
          notes: existingReservation.notes || ''
        });
      }
    }
  }, [isOpen, existingReservation]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/clients/id-name');
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        car: { id: carId },
        client: { id: formData.clientId },
        reservationDate: formData.reservationDate,
        expiryDate: formData.expiryDate,
        status: formData.status,
        depositAmount: formData.depositAmount || null,
        depositPaid: formData.depositPaid,
        notes: formData.notes
      };

      let response;
      if (existingReservation) {
        // Update existing reservation
        response = await axios.put(`http://localhost:9000/api/v1/reservations/${existingReservation.id}`, payload);
      } else {
        // Create new reservation
        console.log(payload);
        response = await axios.post('http://localhost:9000/api/v1/reservations', payload);
      }

      if (response.status === 200 || response.status === 201) {
        onSuccess(response.data);
        onClose();
      }
    } catch (err) {
      console.error("Error saving reservation:", err);
      setError("Failed to save reservation. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!existingReservation || !window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setLoading(true);
    try {
      // Update status to Cancelled
      const response = await axios.put(`http://localhost:9000/api/v1/reservations/${existingReservation.id}`, {
        ...existingReservation,
        status: 'Cancelled'
      });

      if (response.status === 200) {
        onSuccess(response.data);
        onClose();
      }
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setError("Failed to cancel reservation.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {existingReservation ? 'Update Reservation' : 'Create New Reservation'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User size={16} className="mr-1" />
              Client
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reservation Date and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={16} className="mr-1" />
                Reservation Date
              </label>
              <input
                type="datetime-local"
                name="reservationDate"
                value={formData.reservationDate}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock size={16} className="mr-1" />
                Expiry Date
              </label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
              {existingReservation && <option value="Cancelled">Cancelled</option>}
            </select>
          </div>

          {/* Deposit Amount and Paid Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <DollarSign size={16} className="mr-1" />
                Deposit Amount
              </label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                placeholder="Enter deposit amount"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="depositPaid"
                checked={formData.depositPaid}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Deposit Paid
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText size={16} className="mr-1" />
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            {existingReservation && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel Reservation
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : existingReservation ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;