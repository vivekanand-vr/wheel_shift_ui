import React, { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate';
import EmployeeModal from '../components/employees/EmployeeModal';
import { Users, Plus, Search, RefreshCw, Calendar, Award, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [performanceUpdateId, setPerformanceUpdateId] = useState(null);

  // Fetch employees data
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (employeeId, newStatus) => {
    try {
      await axios.patch(`/api/employees/${employeeId}/status`, { status: newStatus });
      // Update local state after successful API call
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
      setStatusUpdateId(null);
    } catch (err) {
      console.error('Error updating employee status:', err);
      setError('Failed to update employee status. Please try again.');
    }
  };

  // Handle performance update
  const handlePerformanceUpdate = async (employeeId, newPerformance) => {
    try {
      await axios.patch(`/api/employees/${employeeId}/performance`, { performance: newPerformance });
      // Update local state after successful API call
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, performance: newPerformance } : emp
        )
      );
      setPerformanceUpdateId(null);
    } catch (err) {
      console.error('Error updating employee performance:', err);
      setError('Failed to update employee performance. Please try again.');
    }
  };

  // Handle employee edit
  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  // Handle adding new employee
  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  // Handle employee save (add/update)
  const handleSaveEmployee = async (employeeData) => {
    try {
      let updatedEmployees;
      
      if (employeeData.id) {
        // Update existing employee
        await axios.put(`http://localhost:9000/api/employees/${employeeData.id}`, employeeData);
        updatedEmployees = employees.map(emp => 
          emp.id === employeeData.id ? { ...emp, ...employeeData } : emp
        );
      } else {
        // Add new employee
        const response = await axios.post('http://localhost:9000/api/employees', employeeData);
        updatedEmployees = [...employees, response.data];
      }
      
      setEmployees(updatedEmployees);
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error saving employee:', err);
      setError('Failed to save employee data. Please try again.');
      // Keep modal open on error
      return false;
    }
    return true;
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate department counts
  const departmentCounts = employees.reduce((acc, employee) => {
    if (employee.department) {
      acc[employee.department] = (acc[employee.department] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <PageTemplate title="Employee Management">
      {/* Error message display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={fetchEmployees}
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center"
            onClick={handleAddEmployee}
          >
            <Plus size={16} className="mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Employees</p>
              <p className="text-2xl font-bold">{employees.filter(e => e.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Award size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Performers</p>
              <p className="text-2xl font-bold">{employees.filter(e => e.performance === 'Excellent').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Calendar size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <p className="text-2xl font-bold">{employees.filter(e => e.status === 'On Leave').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      {Object.keys(departmentCounts).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Department Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(departmentCounts).map(([department, count]) => (
              <div key={department} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{department}</p>
                <p className="text-xl font-bold">{count} employees</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(count / employees.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw size={20} className="animate-spin mr-2 text-blue-500" />
                      <span>Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {employee.name?.split(' ').map(n => n[0]).join('') || '??'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">
                            Joined {new Date(employee.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusUpdateId === employee.id ? (
                        <div className="flex items-center space-x-2">
                          <select 
                            className="text-xs border rounded px-2 py-1"
                            defaultValue={employee.status}
                            onChange={(e) => handleStatusUpdate(employee.id, e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <button 
                            onClick={() => setStatusUpdateId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2
                            ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {employee.status}
                          </span>
                          <button 
                            onClick={() => setStatusUpdateId(employee.id)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {performanceUpdateId === employee.id ? (
                        <div className="flex items-center space-x-2">
                          <select 
                            className="text-xs border rounded px-2 py-1"
                            defaultValue={employee.performance}
                            onChange={(e) => handlePerformanceUpdate(employee.id, e.target.value)}
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                          </select>
                          <button 
                            onClick={() => setPerformanceUpdateId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2
                            ${employee.performance === 'Excellent' ? 'bg-purple-100 text-purple-800' : 
                              employee.performance === 'Good' ? 'bg-blue-100 text-blue-800' : 
                              employee.performance === 'Poor' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {employee.performance}
                          </span>
                          <button 
                            onClick={() => setPerformanceUpdateId(employee.id)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredEmployees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No employees found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Employee Modal */}
      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={currentEmployee}
        onSave={handleSaveEmployee}
      />
    </PageTemplate>
  );
};

export default Employees;