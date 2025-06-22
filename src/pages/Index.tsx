
import React, { useState } from 'react';
import Login from './Login';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboard from './admin/AdminDashboard';
import EncadreurDashboard from './encadreur/EncadreurDashboard';
import EtudiantDashboard from './etudiant/EtudiantDashboard';
import UserManagement from './admin/UserManagement';

const Index = () => {
  // Simulation d'authentification - à remplacer par un vrai système
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    role: 'admin' as 'admin' | 'encadreur' | 'etudiant',
    name: 'Admin Test'
  });
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Si non authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return <Login />;
  }

  // Rendu du contenu selon la page active
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        if (currentUser.role === 'admin') return <AdminDashboard />;
        if (currentUser.role === 'encadreur') return <EncadreurDashboard />;
        if (currentUser.role === 'etudiant') return <EtudiantDashboard />;
        break;
      case 'users':
        return <UserManagement />;
      default:
        return currentUser.role === 'admin' ? <AdminDashboard /> : 
               currentUser.role === 'encadreur' ? <EncadreurDashboard /> : 
               <EtudiantDashboard />;
    }
  };

  return (
    <DashboardLayout 
      userRole={currentUser.role} 
      userName={currentUser.name}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
