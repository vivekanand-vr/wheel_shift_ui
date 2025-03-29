import React from 'react';
import PageTemplate from '../components/PageTemplate.jsx';
import { 
  Car, DollarSign, Calendar, Users, TrendingUp, 
  ClipboardList, Briefcase, Warehouse, BarChart2, 
  Activity, AlertTriangle, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Sample data for dashboard
  const stats = {
    activeCars: 42,
    pendingSales: 8,
    todayAppointments: 5,
    monthlyRevenue: 157500,
    totalReservations: 24,
    storageCapacity: 75 // percentage
  };

  // Sample data for recent activities
  const recentActivities = [
    { id: 1, type: 'car_added', description: 'New car added: 2022 BMW X5', timestamp: '2025-03-12T09:15:00', icon: <Car size={16} className="text-blue-500" /> },
    { id: 2, type: 'reservation', description: 'New reservation for Honda Accord by Jamie Smith', timestamp: '2025-03-11T16:30:00', icon: <Calendar size={16} className="text-purple-500" /> },
    { id: 3, type: 'transaction', description: 'Sale completed: Mercedes-Benz C-Class for $39,500', timestamp: '2025-03-11T14:45:00', icon: <DollarSign size={16} className="text-green-500" /> },
    { id: 4, type: 'appointment', description: 'Test drive scheduled with Alex Johnson at 2:00 PM', timestamp: '2025-03-11T11:20:00', icon: <Users size={16} className="text-indigo-500" /> },
    { id: 5, type: 'car_updated', description: 'Vehicle details updated: 2021 Audi A4', timestamp: '2025-03-10T15:10:00', icon: <ClipboardList size={16} className="text-orange-500" /> }
  ];

  // Sample data for alerts
  const alerts = [
    { id: 1, type: 'expiring_reservation', message: '3 reservations expiring in the next 48 hours', severity: 'high', link: '/reservations' },
    { id: 2, type: 'storage_capacity', message: 'Southside Warehouse reaching 90% capacity', severity: 'medium', link: '/storage-locations' },
    { id: 3, type: 'maintenance', message: '5 vehicles due for maintenance check', severity: 'medium', link: '/cars' },
    { id: 4, type: 'document', message: 'Registration documents pending for 2 vehicles', severity: 'low', link: '/documents' }
  ];

  // Sample data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, type: 'test_drive', customerName: 'Michael Brown', carDetails: '2023 Toyota Camry', date: '2025-03-12T14:30:00' },
    { id: 2, type: 'inspection', customerName: 'Sarah Williams', carDetails: '2022 Honda CR-V', date: '2025-03-12T16:00:00' },
    { id: 3, type: 'delivery', customerName: 'Robert Johnson', carDetails: '2021 Lexus ES', date: '2025-03-13T10:00:00' },
    { id: 4, type: 'negotiation', customerName: 'Emily Davis', carDetails: '2023 Ford Mustang', date: '2025-03-13T13:30:00' },
    { id: 5, type: 'test_drive', customerName: 'James Wilson', carDetails: '2022 BMW 3 Series', date: '2025-03-14T11:00:00' }
  ];

  // Sample data for performance metrics
  const performanceData = {
    salesThisMonth: 18,
    salesLastMonth: 15,
    averageSalesTime: 12, // days
    customerLeads: 34,
    conversionRate: 21 // percentage
  };

  // Function to format currency
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to get alert severity color
  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PageTemplate title="Home">
      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <Car size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Inventory</p>
            <p className="text-xl font-bold">{stats.activeCars} Cars</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <Calendar size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Reservations</p>
            <p className="text-xl font-bold">{stats.totalReservations}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(stats.monthlyRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 mr-4">
            <Briefcase size={24} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Sales</p>
            <p className="text-xl font-bold">{stats.pendingSales}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <Users size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Appointments</p>
            <p className="text-xl font-bold">{stats.todayAppointments}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-cyan-100 mr-4">
            <Warehouse size={24} className="text-cyan-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Storage Capacity</p>
            <p className="text-xl font-bold">{stats.storageCapacity}%</p>
          </div>
        </div>
      </div>
      
      {/* Middle row with alerts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Alerts section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center">
              <AlertTriangle size={20} className="text-amber-500 mr-2" />
              Important Alerts
            </h2>
            <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">
              {alerts.length} Active
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.map(alert => (
              <div key={alert.id} className={`px-6 py-4 ${getAlertSeverityColor(alert.severity)} border-l-4`}>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                  <Link to={alert.link} className="text-sm text-gray-700 hover:text-purple-600 flex items-center">
                    View <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/alerts" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View All Alerts
            </Link>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg flex items-center">
              <Activity size={20} className="text-purple-500 mr-2" />
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map(activity => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/activity" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View All Activity
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom row with appointments and performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg flex items-center">
              <Calendar size={20} className="text-blue-500 mr-2" />
              Upcoming Appointments
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">{appointment.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1">{appointment.carDetails}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{appointment.type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(appointment.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/calendar" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View Calendar
            </Link>
          </div>
        </div>
        
        {/* Performance metrics */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg flex items-center">
              <BarChart2 size={20} className="text-green-500 mr-2" />
              Performance Metrics
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Sales This Month</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                    <TrendingUp size={12} className="mr-1" /> 
                    {((performanceData.salesThisMonth - performanceData.salesLastMonth) / performanceData.salesLastMonth * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-bold">{performanceData.salesThisMonth}</p>
                <p className="text-xs text-gray-500 mt-1">vs {performanceData.salesLastMonth} last month</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Avg. Days to Sale</p>
                <p className="text-2xl font-bold">{performanceData.averageSalesTime}</p>
                <p className="text-xs text-gray-500 mt-1">From listing to purchase</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Customer Leads</p>
                <p className="text-2xl font-bold">{performanceData.customerLeads}</p>
                <p className="text-xs text-gray-500 mt-1">New inquiries this month</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Conversion Rate</p>
                <p className="text-2xl font-bold">{performanceData.conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Leads to sales conversion</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/reports" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View All Reports
            </Link>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Home;