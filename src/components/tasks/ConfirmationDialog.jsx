import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center text-amber-600 mb-4">
            <AlertTriangle size={24} className="mr-2" />
            <span className="font-medium">Warning: This action cannot be undone</span>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this {itemType}{itemName ? `: "${itemName}"` : ''}?
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;