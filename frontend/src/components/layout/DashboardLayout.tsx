import { Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/authStore';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const DashboardLayout = ({ children, allowedRoles }: DashboardLayoutProps) => {
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
          <div className="w-64">
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
