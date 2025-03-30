import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ColumnModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [column, setColumn] = useState({
    title: initialData.title || ''
  });

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setColumn({
        id: initialData.id || null,
        title: initialData.title || ''
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColumn(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(column);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData.id ? 'Edit Column' : 'Create New Column'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Column Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={column.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Enter column title"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              {initialData.id ? 'Update Column' : 'Create Column'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColumnModal;