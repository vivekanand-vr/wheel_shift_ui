import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import { Users, Plus, Search, Filter, RefreshCw, Mail, Phone, Award, Calendar } from 'lucide-react';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample employees data
  const employees = [
    { id: 1, name: 'James Wilson', email: 'james.w@wheelshift.com', phone: '(555) 123-7890', position: 'Sales Manager', department: 'Sales', joinDate: '2022-06-15', status: 'Active', performance: 'Excellent' },
    { id: 2, name: 'Maria Garcia', email: 'maria.g@wheelshift.com', phone: '(555) 234-8901', position: 'Sales Representative', department: 'Sales', joinDate: '2023-01-10', status: 'Active', performance: 'Good' },
    { id: 3, name: 'Robert Chen', email: 'robert.c@wheelshift.com', phone: '(555) 345-9012', position: 'Inventory Manager', department: 'Operations', joinDate: '2022-03-22', status: 'Active', performance: 'Excellent' },
    { id: 4, name: 'Lisa Thompson', email: 'lisa.t@wheelshift.com', phone: '(555) 456-0123', position: 'Finance Specialist', department: 'Finance', joinDate: '2023-05-14', status: 'Active', performance: 'Good' },
    { id: 5, name: 'Kevin Patel', email: 'kevin.p@wheelshift.com', phone: '(555) 567-1234', position: 'Mechanic', department: 'Service', joinDate: '2022-08-30', status: 'Active', performance: 'Good' },
    { id: 6, name: 'Amanda Lee', email: 'amanda.l@wheelshift.com', phone: '(555) 678-2345', position: 'Customer Service Rep', department: 'Customer Service', joinDate: '2023-03-18', status: 'On Leave', performance: 'Excellent' },
    { id: 7, name: 'David Rodriguez', email: 'david.r@wheelshift.com', phone: '(555) 789-3456', position: 'Sales Representative', department: 'Sales', joinDate: '2023-07-05', status: 'Active', performance: 'Average' },
    { id: 8, name: 'Sophia Kim', email: 'sophia.k@wheelshift.com', phone: '(555) 890-4567', position: 'Marketing Specialist', department: 'Marketing', joinDate: '2022-11-12', status: 'Active', performance: 'Good' },
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate department counts
  const departmentCounts = employees.reduce((acc, employee) => {
    acc[employee.department] = (acc[employee.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <PageTemplate title="Employee Management">
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
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center">
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
              <p className="text-sm text-gray-500">Sales Team</p>
              <p className="text-2xl font-bold">{departmentCounts['Sales'] || 0}</p>
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
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">Joined {new Date(employee.joinDate).toLocaleDateString()}</div>
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${employee.performance === 'Excellent' ? 'bg-purple-100 text-purple-800' : 
                        employee.performance === 'Good' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {employee.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEmployees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No employees found matching your search criteria.</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Employees;