
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'encadreur' | 'etudiant';
  userName: string;
  onNavigate: (page: string) => void;
}

const DashboardLayout = ({ children, userRole, userName, onNavigate }: DashboardLayoutProps) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    onNavigate(item);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        userRole={userRole} 
        activeItem={activeItem} 
        onItemClick={handleItemClick} 
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
