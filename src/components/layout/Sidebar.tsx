
import React from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  FileText, 
  CreditCard, 
  Calendar,
  BarChart3,
  GraduationCap,
  ClipboardList,
  Archive
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  userRole: 'admin' | 'encadreur' | 'etudiant';
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar = ({ userRole, activeItem, onItemClick }: SidebarProps) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'subjects', label: 'Sujets', icon: BookOpen },
    { id: 'memoires', label: 'Mémoires', icon: FileText },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'jurys', label: 'Jurys', icon: GraduationCap },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'archive', label: 'Archive', icon: Archive },
  ];

  const encadreurMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'my-subjects', label: 'Mes Sujets', icon: BookOpen },
    { id: 'students', label: 'Mes Étudiants', icon: Users },
    { id: 'sessions', label: 'Séances', icon: Calendar },
    { id: 'memoires', label: 'Mémoires', icon: FileText },
  ];

  const etudiantMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'subjects', label: 'Choisir un Sujet', icon: BookOpen },
    { id: 'my-memoir', label: 'Mon Mémoire', icon: FileText },
    { id: 'sessions', label: 'Séances', icon: Calendar },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: ClipboardList },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin': return adminMenuItems;
      case 'encadreur': return encadreurMenuItems;
      case 'etudiant': return etudiantMenuItems;
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">ISI Platform</h1>
            <p className="text-xs text-gray-500">Gestion des Mémoires</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-11 px-4 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => onItemClick(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
              {item.id === 'subjects' && userRole === 'etudiant' && (
                <Badge className="ml-auto bg-green-100 text-green-800">12</Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 text-center">
            Version 1.0.0<br/>
            ISI Platform © 2024
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
