
import React, { useState } from 'react';
import Login from './Login';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboard from './admin/AdminDashboard';
import EncadreurDashboard from './encadreur/EncadreurDashboard';
import EtudiantDashboard from './etudiant/EtudiantDashboard';
import UserManagement from './admin/UserManagement';
import SubjectManagement from './admin/SubjectManagement';
import MemoireManagement from './admin/MemoireManagement';
import PaymentManagement from './admin/PaymentManagement';
import JuryManagement from './admin/JuryManagement';
import Statistics from './admin/Statistics';
import MySubjects from './encadreur/MySubjects';
import MyStudents from './encadreur/MyStudents';
import Sessions from './encadreur/Sessions';
import SubjectSelection from './etudiant/SubjectSelection';
import MyMemoir from './etudiant/MyMemoir';
import MentoringSessions from './etudiant/MentoringSessions';
import Payment from './etudiant/Payment';

const Index = () => {
  // Simulation d'authentification - à remplacer par un vrai système
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    role: 'admin' as 'admin' | 'encadreur' | 'etudiant',
    name: 'Admin Test'
  });
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Fonction de connexion temporaire pour le développement
  const handleLogin = (role: 'admin' | 'encadreur' | 'etudiant') => {
    setIsAuthenticated(true);
    setCurrentUser({
      role: role,
      name: role === 'admin' ? 'Admin Test' : 
            role === 'encadreur' ? 'Dr. Ahmed Ben Ali' : 'Marie Dupont'
    });
  };

  // Si non authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Rendu du contenu selon la page active et le rôle
  const renderContent = () => {
    // Pages Admin
    if (currentUser.role === 'admin') {
      switch (currentPage) {
        case 'dashboard': return <AdminDashboard />;
        case 'users': return <UserManagement />;
        case 'subjects': return <SubjectManagement />;
        case 'memoires': return <MemoireManagement />;
        case 'payments': return <PaymentManagement />;
        case 'jurys': return <JuryManagement />;
        case 'statistics': return <Statistics />;
        default: return <AdminDashboard />;
      }
    }
    
    // Pages Encadreur
    if (currentUser.role === 'encadreur') {
      switch (currentPage) {
        case 'dashboard': return <EncadreurDashboard />;
        case 'my-subjects': return <MySubjects />;
        case 'students': return <MyStudents />;
        case 'sessions': return <Sessions />;
        case 'memoires': return <MemoireManagement />;
        default: return <EncadreurDashboard />;
      }
    }
    
    // Pages Étudiant
    if (currentUser.role === 'etudiant') {
      switch (currentPage) {
        case 'dashboard': return <EtudiantDashboard />;
        case 'subjects': return <SubjectSelection />;
        case 'my-memoir': return <MyMemoir />;
        case 'sessions': return <MentoringSessions />;
        case 'payment': return <Payment />;
        default: return <EtudiantDashboard />;
      }
    }

    // Fallback
    return currentUser.role === 'admin' ? <AdminDashboard /> : 
           currentUser.role === 'encadreur' ? <EncadreurDashboard /> : 
           <EtudiantDashboard />;
  };

  return (
    <DashboardLayout 
      userRole={currentUser.role} 
      userName={currentUser.name}
      onNavigate={setCurrentPage}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
