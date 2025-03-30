import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Tag, AlertCircle } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    tags: ''
  });

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setTask({
        id: initialData.id || null,
        columnId: initialData.columnId || null,
        title: initialData.title || '',
        description: initialData.description || '',
        assignee: initialData.assignee || '',
        dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
        priority: initialData.priority || 'medium',
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process the tags - split by comma and trim whitespace
    const processedTags = task.tags
      ? task.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];
    
    // Make sure to include the columnId
    onSave({
      ...task,
      tags: processedTags
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData.id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Task Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={task.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter task title"
              />
            </div>
            
            {/* Task Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={task.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter task description"
              ></textarea>
            </div>
            
            {/* Assignee */}
            <div>
              <label htmlFor="assignee" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <User size={16} className="mr-1" />
                Assignee
              </label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={task.assignee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter assignee name"
              />
            </div>
            
            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={16} className="mr-1" />
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Tag size={16} className="mr-1" />
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={task.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas (e.g., design, frontend, urgent)</p>
            </div>
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
            >
              {initialData.id ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;