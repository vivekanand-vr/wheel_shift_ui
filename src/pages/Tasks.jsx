import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from 'axios';
import TaskModal from '../components/manageTasks/TaskModal.jsx';
import ColumnModal from '../components/manageTasks/ColumnModal.jsx';
import ConfirmationDialog from '../components/manageTasks/ConfirmationDialog.jsx';

import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Loader, 
  CheckCircle, 
  User, 
  Calendar, 
  Tag, 
  MoreHorizontal, 
  PlusCircle,
  Edit,
  Trash
} from 'lucide-react';

// Base URL for API
const API_BASE_URL = 'http://localhost:9000/api/kanban';

const Tasks = () => {
  // State for kanban data
  const [data, setData] = useState({
    tasks: {},
    columns: {},
    columnOrder: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentTaskData, setCurrentTaskData] = useState({});
  const [currentColumnData, setCurrentColumnData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: null, name: null, columnId: null });

  // Fetch kanban board data
  const fetchKanbanBoard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/board`);
      
      // Transform the data from backend format to the format used by the component
      const boardData = response.data;
      const transformedData = transformBoardData(boardData);
      
      setData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching kanban board:', err);
      setError('Failed to load tasks. Please try again later.');
      setLoading(false);
      
      // If board doesn't exist yet, initialize it
      if (err.response && err.response.status === 404) {
        try {
          await axios.post(`${API_BASE_URL}/initialize`);
          fetchKanbanBoard(); // Try fetching again after initialization
        } catch (initErr) {
          console.error('Error initializing board:', initErr);
        }
      }
    }
  };

  // Transform data from backend format to the format used by the component
  const transformBoardData = (boardData) => {
    // Convert tasks array to object with taskId as key
    const tasksObj = {};
    boardData.tasks.forEach(task => {
      tasksObj[task.id] = {
        id: task.id,
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        dueDate: task.dueDate,
        priority: task.priority,
        tags: task.tags || []
      };
    });
    
    // Convert columns array to object with columnId as key
    const columnsObj = {};
    boardData.columns.forEach(column => {
      columnsObj[column.id] = {
        id: column.id,
        title: column.title,
        taskIds: column.taskIds || []
      };
    });
    
    return {
      tasks: tasksObj,
      columns: columnsObj,
      columnOrder: boardData.columnOrder
    };
  };

  // Handle drag end
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Apply the change optimistically in the UI first
    // Find source and destination columns
    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
    } else {
      // Moving from one column to another
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      
      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      };

      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);
      
      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestColumn.id]: newDestColumn,
        },
      };

      setData(newData);
    }

    // Then send the update to the backend
    try {
      await axios.post(`${API_BASE_URL}/move-task`, {
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        sourceIndex: source.index,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index
      });
    } catch (err) {
      console.error('Error updating task position:', err);
      // If the API call fails, revert back to the original state by re-fetching
      fetchKanbanBoard();
    }
  };

  // Open task modal with selected column ID
  const openTaskModal = (columnId, task = {}) => {
    setCurrentTaskData({ ...task, columnId });
    setIsTaskModalOpen(true);
  };

  // Open column modal
  const openColumnModal = (column = {}) => {
    setCurrentColumnData(column);
    setIsColumnModalOpen(true);
  };

  // Open confirmation dialog for deletion
  const openConfirmDialog = (id, type, name, columnId = null) => {
    setDeleteTarget({ id, type, name, columnId });
    setIsConfirmDialogOpen(true);
  };

  // Handler for task operations (both create and update)
  const handleTaskOperation = async (taskData) => {
    const isEditing = !!taskData.id;
    const columnId = taskData.columnId;

    try {
      let response;
      let updatedData = { ...data };

      if (isEditing) {
        // Update existing task
        response = await axios.put(`${API_BASE_URL}/tasks/${taskData.id}`, taskData);
        const updatedTask = response.data;

        // Update the task in local state
        updatedData = {
          ...data,
          tasks: {
            ...data.tasks,
            [updatedTask.id]: {
              id: updatedTask.id,
              title: updatedTask.title,
              description: updatedTask.description,
              assignee: updatedTask.assignee,
              dueDate: updatedTask.dueDate,
              priority: updatedTask.priority,
              tags: updatedTask.tags || []
            }
          }
        };
      } else {
        // Create new task
        const taskToSend = { ...taskData };
        delete taskToSend.columnId; // Remove columnId before sending to API
        
        response = await axios.post(`${API_BASE_URL}/tasks?columnId=${columnId}`, taskToSend);
        const createdTask = response.data;
        
        // Add the new task to local state
        updatedData = {
          ...data,
          tasks: {
            ...data.tasks,
            [createdTask.id]: {
              id: createdTask.id,
              title: createdTask.title,
              description: createdTask.description,
              assignee: createdTask.assignee,
              dueDate: createdTask.dueDate,
              priority: createdTask.priority,
              tags: createdTask.tags || []
            }
          },
          columns: {
            ...data.columns,
            [columnId]: {
              ...data.columns[columnId],
              taskIds: [...data.columns[columnId].taskIds, createdTask.id]
            }
          }
        };
      }
      
      setData(updatedData);
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} task:`, err);
      // Show an error message to the user
      alert(`Failed to ${isEditing ? 'update' : 'create'} task. Please try again.`);
    }
  };

  // Handler for column operations (both create and update)
  const handleColumnOperation = async (columnData) => {
    const isEditing = !!columnData.id;

    try {
      let response;
      let updatedData = { ...data };

      if (isEditing) {
        // Update existing column
        response = await axios.put(`${API_BASE_URL}/columns/${columnData.id}`, columnData);
        const updatedColumn = response.data;

        // Update the column in local state
        updatedData = {
          ...data,
          columns: {
            ...data.columns,
            [updatedColumn.id]: {
              ...data.columns[updatedColumn.id],
              title: updatedColumn.title
            }
          }
        };
      } else {
        // Create new column
        response = await axios.post(`${API_BASE_URL}/columns`, columnData);
        const createdColumn = response.data;
        
        // Add the new column to local state
        updatedData = {
          ...data,
          columns: {
            ...data.columns,
            [createdColumn.id]: {
              id: createdColumn.id,
              title: createdColumn.title,
              taskIds: []
            }
          },
          columnOrder: [...data.columnOrder, createdColumn.id]
        };
      }
      
      setData(updatedData);
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} column:`, err);
      // Show an error message to the user
      alert(`Failed to ${isEditing ? 'update' : 'create'} column. Please try again.`);
    }
  };

  // Delete a task
  const deleteTask = async (taskId, columnId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      
      // Update local state
      const newTaskIds = data.columns[columnId].taskIds.filter(id => id !== taskId);
      
      const newData = {
        ...data,
        tasks: Object.keys(data.tasks).reduce((acc, key) => {
          if (key !== taskId) {
            acc[key] = data.tasks[key];
          }
          return acc;
        }, {}),
        columns: {
          ...data.columns,
          [columnId]: {
            ...data.columns[columnId],
            taskIds: newTaskIds
          }
        }
      };
      
      setData(newData);
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Delete a column
  const deleteColumn = async (columnId) => {
    try {
      await axios.delete(`${API_BASE_URL}/columns/${columnId}`);
      
      // Update local state
      const newColumnOrder = data.columnOrder.filter(id => id !== columnId);
      
      const newData = {
        ...data,
        columns: Object.keys(data.columns).reduce((acc, key) => {
          if (key !== columnId) {
            acc[key] = data.columns[key];
          }
          return acc;
        }, {}),
        columnOrder: newColumnOrder
      };
      
      setData(newData);
    } catch (err) {
      console.error('Error deleting column:', err);
      alert('Failed to delete column. Please try again.');
    }
  };

  // Handle confirmation dialog actions
  const handleConfirmDelete = () => {
    const { id, type, columnId } = deleteTarget;
    
    if (type === 'task') {
      deleteTask(id, columnId);
    } else if (type === 'column') {
      deleteColumn(id);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchKanbanBoard();
  }, []);

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get column header icon
  const getColumnIcon = (columnId) => {
    const index = data.columnOrder.indexOf(columnId);
    
    switch (index) {
      case 0: // To Do
        return <Clock size={18} className="text-gray-600" />;
      case 1: // In Progress
        return <Loader size={18} className="text-blue-600" />;
      case 2: // Review
        return <AlertCircle size={18} className="text-yellow-600" />;
      case 3: // Done
        return <CheckCircle size={18} className="text-green-600" />;
      default:
        return <CheckSquare size={18} className="text-gray-600" />;
    }
  };

  // Format date 
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get days remaining for due date
  const getDaysRemaining = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  };

  // Get due date color based on days remaining
  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-gray-600';
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'text-red-600';
    } else if (diffDays <= 2) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  };

  if (loading) {
    return (
      <PageTemplate title="Task Management">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate title="Task Management">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchKanbanBoard} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Try Again
          </button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Task Management">
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Header section with filters and controls */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap justify-between items-center">
            <h2 className="font-semibold text-lg mb-2 flex items-center">
              <CheckSquare size={20} className="text-purple-500 mr-2" />
              Task Kanban Board
            </h2>
            <button 
              onClick={() => openColumnModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center text-sm font-medium"
            >
              <PlusCircle size={16} className="mr-1" />
              Add Column
            </button>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            
            return (
              <div key={column.id} className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    {getColumnIcon(column.id)}
                    <h3 className="font-semibold ml-2">{column.title}</h3>
                    <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {column.taskIds.length}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openColumnModal(column)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => openConfirmDialog(column.id, 'column', column.title)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-3 min-h-64 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                      style={{ minHeight: '50vh' }}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 p-3 bg-white rounded-lg border ${snapshot.isDragging ? 'border-blue-400 shadow-lg' : 'border-gray-200'}`}
                            >
                              <div className="mb-2">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                                  <div className="flex items-center">
                                    <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </span>
                                    <div className="flex ml-2 space-x-1">
                                      <button 
                                        onClick={() => openTaskModal(column.id, task)}
                                        className="text-gray-400 hover:text-blue-600"
                                      >
                                        <Edit size={14} />
                                      </button>
                                      <button 
                                        onClick={() => openConfirmDialog(task.id, 'task', task.title, column.id)}
                                        className="text-gray-400 hover:text-red-600"
                                      >
                                        <Trash size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                {task.tags && task.tags.map((tag, i) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                                    <Tag size={12} className="mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="flex justify-between items-center mt-2 text-xs">
                                <div className="flex items-center text-gray-600">
                                  <User size={14} className="mr-1" />
                                  {task.assignee}
                                </div>
                                <div className={`flex items-center ${getDueDateColor(task.dueDate)}`}>
                                  <Calendar size={14} className="mr-1" />
                                  {formatDate(task.dueDate)} ({getDaysRemaining(task.dueDate)})
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                
                <div className="px-4 py-3 border-t border-gray-200">
                  <button 
                    className="w-full py-2 text-gray-600 hover:text-purple-600 text-sm flex items-center justify-center"
                    onClick={() => openTaskModal(column.id)}
                  >
                    <PlusCircle size={16} className="mr-1" />
                    Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskOperation}
        initialData={currentTaskData}
      />

      {/* Column Modal */}
      <ColumnModal 
        isOpen={isColumnModalOpen} 
        onClose={() => setIsColumnModalOpen(false)}
        onSave={handleColumnOperation}
        initialData={currentColumnData}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemType={deleteTarget.type}
        itemName={deleteTarget.name}
      />
    </PageTemplate>
  );
};

export default Tasks;