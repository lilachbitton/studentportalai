import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegistrationForm } from './components/RegistrationForm';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { api } from './services/api';

type Page = 'login' | 'register';
type UserRole = 'student' | 'admin';

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const handleLoginSuccess = (role: UserRole) => setUserRole(role);
  const handleLogout = () => {
    api.logout();
    setUserRole(null);
  };
  
  const navigateToRegister = () => setCurrentPage('register');
  const navigateToLogin = () => {
    setUserRole(null);
    setCurrentPage('login');
  };

  const openForgotPasswordModal = () => setForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setForgotPasswordModalOpen(false);

  if (userRole === 'student') {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div 
      className="relative min-h-screen w-full bg-slate-900"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <main className="relative z-10 w-full h-screen flex items-center justify-center lg:justify-end">
        <div className="w-full max-w-md lg:mr-24 px-4">
            {currentPage === 'login' ? (
              <LoginForm 
                onNavigateToRegister={navigateToRegister} 
                onForgotPassword={openForgotPasswordModal}
                onLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <RegistrationForm 
                onNavigateToLogin={navigateToLogin} 
                onRegistrationSuccess={navigateToLogin}
              />
            )}
        </div>
      </main>

      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={closeForgotPasswordModal} 
      />
    </div>
  );
}

export default App;