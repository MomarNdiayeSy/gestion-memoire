
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'encadreur' | 'etudiant';
  userName: string;
}

const DashboardLayout = ({ children, userRole, userName }: DashboardLayoutProps) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        userRole={userRole} 
        activeItem={activeItem} 
        onItemClick={setActiveItem} 
      />
      <div className="flex-1 flex flex-col">
        <Header userRole={userRole} userName={userName} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
