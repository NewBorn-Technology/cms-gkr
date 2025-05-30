'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('User');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Get user info from localStorage if available
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { name, email } = JSON.parse(userInfo);
        setUserName(name || 'User');
        setUserEmail(email || '');
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Welcome, {userName}</h2>
              {userEmail && <p className="text-sm text-gray-600">{userEmail}</p>}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <Sidebar />
          </nav>

          {/* Fixed Bottom Sign Out Button */}
          <div className="fixed bottom-0 left-0 w-64 p-4 bg-white border-t">
            <button
              onClick={handleSignOut}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
} 