import React from 'react';
import Header from './Header';
import Sidebar from '../components/Sidebar';

const PageTemplate = ({ title, children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title={title} />
        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageTemplate;