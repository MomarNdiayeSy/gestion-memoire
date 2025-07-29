import { useAuth } from './stores/authStore';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import AdminMemoires from './pages/admin/Memoires';
import MemoireManagement from './pages/admin/MemoireManagement';
import JuryManagement from './pages/admin/JuryManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import Statistics from './pages/admin/Statistics';

// Encadreur Pages
import EncadreurDashboard from './pages/encadreur/EncadreurDashboard';
import MyStudents from './pages/encadreur/MyStudents';
import MySubjects from './pages/encadreur/MySubjects';
import Sessions from './pages/encadreur/Sessions';
import Memoires from './pages/encadreur/Memoires';

// Etudiant Pages
import EtudiantDashboard from './pages/etudiant/EtudiantDashboard';
import SubjectSelection from './pages/etudiant/SubjectSelection';
import MyMemoir from './pages/etudiant/MyMemoir';
import MentoringSessions from './pages/etudiant/MentoringSessions';
import Payment from './pages/etudiant/Payment';

function App() {
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  // Fonction pour rediriger vers le tableau de bord approprié
  const getDefaultRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'ENCADREUR':
        return '/encadreur/dashboard';
      case 'ETUDIANT':
        return '/etudiant/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Redirection de la racine vers le tableau de bord approprié */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SubjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/memoireManagement"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MemoireManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/validationMemoires"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminMemoires />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jurys"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <JuryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PaymentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Statistics />
            </ProtectedRoute>
          }
        />

        {/* Encadreur Routes */}
        <Route path="/encadreur" element={<Navigate to="/encadreur/dashboard" replace />} />
        <Route
          path="/encadreur/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ENCADREUR']}>
              <EncadreurDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encadreur/students"
          element={
            <ProtectedRoute allowedRoles={['ENCADREUR']}>
              <MyStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encadreur/subjects"
          element={
            <ProtectedRoute allowedRoles={['ENCADREUR']}>
              <MySubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encadreur/sessions"
          element={
            <ProtectedRoute allowedRoles={['ENCADREUR']}>
              <Sessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encadreur/memoires"
          element={
            <ProtectedRoute allowedRoles={['ENCADREUR']}>
              <Memoires />
            </ProtectedRoute>
          }
        />

        {/* Etudiant Routes */}
        <Route path="/etudiant" element={<Navigate to="/etudiant/dashboard" replace />} />
        <Route
          path="/etudiant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <EtudiantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etudiant/subjects"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <SubjectSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etudiant/memoire"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <MyMemoir />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etudiant/sessions"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <MentoringSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etudiant/payment"
          element={
            <ProtectedRoute allowedRoles={['ETUDIANT']}>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
