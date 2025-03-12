import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  PlusCircle
} from 'lucide-react';

const Tasks = () => {
  // Initial data for the Kanban board
  const initialData = {
    tasks: {
      'task-1': { 
        id: 'task-1', 
        title: 'Update vehicle listings', 
        description: 'Add new inventory with photos',
        assignee: 'John Doe', 
        dueDate: '2025-03-15',
        priority: 'high',
        tags: ['inventory', 'website']
      },
      'task-2': { 
        id: 'task-2', 
        title: 'Follow up with customer inquiries', 
        description: 'Reply to all pending customer messages',
        assignee: 'Jane Smith', 
        dueDate: '2025-03-13',
        priority: 'medium',
        tags: ['customers', 'sales']
      },
      'task-3': { 
        id: 'task-3', 
        title: 'Schedule maintenance for showroom vehicles', 
        description: 'Arrange service for display models',
        assignee: 'Mike Johnson', 
        dueDate: '2025-03-20',
        priority: 'low',
        tags: ['maintenance', 'service']
      },
      'task-4': { 
        id: 'task-4', 
        title: 'Prepare monthly sales report', 
        description: 'Compile sales data for management review',
        assignee: 'Sarah Williams', 
        dueDate: '2025-03-31',
        priority: 'high',
        tags: ['reports', 'finance']
      },
      'task-5': { 
        id: 'task-5', 
        title: 'Order new promotional materials', 
        description: 'Get brochures and banners for upcoming sale',
        assignee: 'John Doe', 
        dueDate: '2025-03-18',
        priority: 'medium',
        tags: ['marketing', 'promotion']
      },
      'task-6': { 
        id: 'task-6', 
        title: 'Update CRM with new leads', 
        description: 'Enter contact information for potential customers',
        assignee: 'Jane Smith', 
        dueDate: '2025-03-14',
        priority: 'medium',
        tags: ['customers', 'crm']
      },
      'task-7': { 
        id: 'task-7', 
        title: 'Review pricing strategy', 
        description: 'Analyze competitor prices and adjust accordingly',
        assignee: 'Mike Johnson', 
        dueDate: '2025-03-25',
        priority: 'high',
        tags: ['strategy', 'pricing']
      },
      'task-8': { 
        id: 'task-8', 
        title: 'Process vehicle registrations', 
        description: 'Complete paperwork for recent sales',
        assignee: 'Sarah Williams', 
        dueDate: '2025-03-16',
        priority: 'high',
        tags: ['admin', 'legal']
      }
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To Do',
        taskIds: ['task-1', 'task-4', 'task-7'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        taskIds: ['task-2', 'task-5', 'task-8'],
      },
      'column-3': {
        id: 'column-3',
        title: 'Review',
        taskIds: ['task-6'],
      },
      'column-4': {
        id: 'column-4',
        title: 'Done',
        taskIds: ['task-3'],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  };

  // State for kanban data
  const [data, setData] = useState(initialData);
  
  // Handle drag end
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

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
      return;
    }

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
  };

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
    switch (columnId) {
      case 'column-1': // To Do
        return <Clock size={18} className="text-gray-600" />;
      case 'column-2': // In Progress
        return <Loader size={18} className="text-blue-600" />;
      case 'column-3': // Review
        return <AlertCircle size={18} className="text-yellow-600" />;
      case 'column-4': // Done
        return <CheckCircle size={18} className="text-green-600" />;
      default:
        return <CheckSquare size={18} className="text-gray-600" />;
    }
  };

  // Format date 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get days remaining for due date
  const getDaysRemaining = (dateString) => {
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
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center text-sm font-medium">
                <PlusCircle size={16} className="mr-1" />
                Add New Task
              </button>
            </div>
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
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
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
                                  <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                {task.tags.map((tag, i) => (
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
                  <button className="w-full py-2 text-gray-600 hover:text-purple-600 text-sm flex items-center justify-center">
                    <PlusCircle size={16} className="mr-1" />
                    Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </PageTemplate>
  );
};

export default Tasks;