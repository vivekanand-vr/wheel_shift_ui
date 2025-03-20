import React from 'react';
import PageTemplate from '../components/PageTemplate';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Percent,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {

  return (
    <PageTemplate title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Inventory" 
          value="126" 
          change="+5%" 
          icon={<ShoppingCart className="text-blue-500" />} 
          trend="up"
        />
        <StatsCard 
          title="Total Sales" 
          value="$487,350" 
          change="+12%" 
          icon={<BarChart3 className="text-green-500" />} 
          trend="up"
        />
        <StatsCard 
          title="Clients" 
          value="1,254" 
          change="+8%" 
          icon={<Users className="text-purple-500" />} 
          trend="up"
        />
        <StatsCard 
          title="Conversion Rate" 
          value="24.5%" 
          change="-2%" 
          icon={<Percent className="text-orange-500" />} 
          trend="down"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Sales Chart Placeholder</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Inventory by Category</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Inventory Chart Placeholder</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 10, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Vehicle Sale</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toyota Camry 2022</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$28,500</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTemplate>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, change, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-blue-50">{icon}</div>
      </div>
      <div className="flex items-center mt-4">
        <TrendingUp className={`mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} size={16} />
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{change} from last month</span>
      </div>
    </div>
  );
};

export default Dashboard;