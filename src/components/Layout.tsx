
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

type LayoutProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
};

const Layout = ({ children, requireAuth = false, requireAdmin = false }: LayoutProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  if (user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
