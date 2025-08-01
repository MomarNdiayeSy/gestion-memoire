import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../stores/authStore';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  CreditCard,
  BarChart,
  BookMarked,
  GraduationCap,
  Video,
  FileSpreadsheet,
  Receipt,
  Wallet,
  CheckCircle,
  PieChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { useEffect } from 'react';

const Sidebar = () => {
  const { user, token, checkAuth } = useAuth();
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, token, checkAuth]);
  const location = useLocation();

  const adminMenuItems = [
    { icon: BookOpen, label: 'Bibliothèque', path: '/library' },
    { icon: BarChart, label: 'Tableau de bord', path: '/admin/dashboard' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: BookMarked, label: 'Sujets', path: '/admin/subjects' },
    { icon: FileText, label: 'Catalogue mémoires', path: '/admin/memoireManagement' },
    { icon: CheckCircle, label: 'Validation mémoires', path: '/admin/validationMemoires' },
    { icon: GraduationCap, label: 'Jurys', path: '/admin/jurys' },
    { icon: Receipt, label: 'Paiements', path: '/admin/payments' },
    { icon: PieChart, label: 'Statistiques', path: '/admin/statistics' }
  ];

  const encadreurMenuItems = [
    { icon: BookOpen, label: 'Bibliothèque', path: '/library' },
    { icon: BarChart, label: 'Tableau de bord', path: '/encadreur/dashboard' },
    { icon: Users, label: 'Mes étudiants', path: '/encadreur/students' },
    { icon: BookMarked, label: 'Mes sujets', path: '/encadreur/subjects' },
    { icon: Video, label: 'Sessions', path: '/encadreur/sessions' },
    { icon: FileText, label: 'Mémoires', path: '/encadreur/memoires' }
  ];

  const etudiantMenuItems = [
    { icon: BookOpen, label: 'Bibliothèque', path: '/library' },
    { icon: BarChart, label: 'Tableau de bord', path: '/etudiant/dashboard' },
    { icon: BookMarked, label: 'Choix du sujet', path: '/etudiant/subjects' },
    { icon: BookOpen, label: 'Mon mémoire', path: '/etudiant/memoire' },
    { icon: Video, label: 'Sessions', path: '/etudiant/sessions' },
    { icon: Wallet, label: 'Paiement', path: '/etudiant/payment' }
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return adminMenuItems;
      case 'ENCADREUR':
        return encadreurMenuItems;
      case 'ETUDIANT':
        return etudiantMenuItems;
      default:
        return [];
    }
  };

  // Attendre que l'utilisateur soit chargé pour afficher la sidebar
  if (!user) {
    return (
      <aside className="w-64 min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-500">Chargement...</span>
      </aside>
    );
  }

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.role === 'ADMIN' ? 'Administration' :
           user?.role === 'ENCADREUR' ? 'Espace Encadreur' :
           'Espace Étudiant'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {user?.prenom} {user?.nom}
        </p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <Badge className="ml-auto bg-blue-100 text-blue-600 border-0">
                      Actif
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
