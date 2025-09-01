import { Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/authStore';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  userRole?: 'admin' | 'encadreur' | 'etudiant';
  userName?: string;
  onNavigate?: (page: string) => void;
}

const DashboardLayout = ({ children, allowedRoles, userRole, userName, onNavigate }: DashboardLayoutProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar fixe */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-200 bg-white">
              <img src="/logo-isi.jpg" alt="Logo ISI" className="h-12 w-12 object-contain" />
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Gestion&nbsp;<span className="whitespace-nowrap">mémoires</span></h1>
            </div>
            <Sidebar />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <Header />
          
          {/* Zone de défilement */}
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
