
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Server, 
  Settings, 
  Users, 
  LogOut, 
  Database, 
  ChevronLeft, 
  ChevronRight,
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`bg-sidebar h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/dashboard" className="text-xl font-bold text-game-primary">
            GamePanel
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive('/dashboard')
                  ? 'bg-sidebar-accent text-game-primary border-l-4 border-game-primary'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              <LayoutDashboard size={20} />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/servers"
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive('/servers') || location.pathname.startsWith('/servers/')
                  ? 'bg-sidebar-accent text-game-primary border-l-4 border-game-primary'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              <Server size={20} />
              {!collapsed && <span className="ml-3">My Servers</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/plans"
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive('/plans')
                  ? 'bg-sidebar-accent text-game-primary border-l-4 border-game-primary'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              <CreditCard size={20} />
              {!collapsed && <span className="ml-3">Subscription</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive('/settings')
                  ? 'bg-sidebar-accent text-game-primary border-l-4 border-game-primary'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              <Settings size={20} />
              {!collapsed && <span className="ml-3">Settings</span>}
            </Link>
          </li>
          
          {isAdmin() && (
            <>
              <li className="pt-4">
                {!collapsed && <div className="px-4 text-xs text-muted-foreground mb-2">Admin</div>}
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isActive('/admin/users')
                      ? 'bg-sidebar-accent text-game-primary border-l-4 border-game-primary'
                      : 'hover:bg-sidebar-accent'
                  }`}
                >
                  <Users size={20} />
                  {!collapsed && <span className="ml-3">Users</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/servers"
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isActive('/admin/servers')
                      ? 'bg-sidebar-accent text-game-primary border-l-4 border-game-primary'
                      : 'hover:bg-sidebar-accent'
                  }`}
                >
                  <Database size={20} />
                  {!collapsed && <span className="ml-3">All Servers</span>}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
        
        {!collapsed && (
          <div className="mt-4 text-xs text-center text-muted-foreground">
            <div>Logged in as:</div>
            <div className="font-medium text-foreground">{user.username}</div>
            <div className="mt-1 px-2 py-1 rounded-full bg-game-primary text-xs inline-block">{user.role}</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
