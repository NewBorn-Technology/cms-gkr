'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { LogOut, Home, Calendar, BookOpen, Users } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { getUserName } from '@/utils/auth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our utility function to get user name
  const [userName, setUserName] = useState<string>(getUserName());
  const [userEmail, setUserEmail] = useState<string>(user?.user?.email || '');

  useEffect(() => {
    // Update userName whenever store user changes
    setUserName(getUserName());
    setUserEmail(user?.user?.email || '');
    setIsLoading(false);
    
    console.log("DashboardLayout - current user:", getUserName());
  }, [user]);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const handleHome = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r border-gray-200">
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <div className="relative h-10 w-40">
            <Image 
              src="/images/shepherd-logo.png" 
              alt="Shepherd Logo" 
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
              {userName.charAt(0)}
            </div>
            <div className="ml-3">
              <h2 className="text-sm font-medium text-gray-800">{userName}</h2>
              {userEmail && <p className="text-xs text-gray-500">{userEmail}</p>}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <Sidebar />
        </nav>

        {/* Bottom Buttons */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Mobile only */}
        <header className="bg-white shadow-sm z-10 md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium mr-2">
                {userName.charAt(0)}
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="grid grid-cols-4 h-16">
            <button 
              onClick={() => router.push('/home')}
              className="flex flex-col items-center justify-center"
            >
              <Home className={`h-5 w-5 ${
                pathname === '/home' ? 'text-primary' : 'text-gray-500'
              }`} />
              <span className={`mt-1 text-xs ${
                pathname === '/home' ? 'text-primary font-medium' : 'text-gray-500'
              }`}>Home</span>
            </button>
            
            <button 
              onClick={() => router.push('/church-events')}
              className="flex flex-col items-center justify-center"
            >
              <Calendar className={`h-5 w-5 ${
                pathname === '/church-events' ? 'text-primary' : 'text-gray-500'
              }`} />
              <span className={`mt-1 text-xs ${
                pathname === '/church-events' ? 'text-primary font-medium' : 'text-gray-500'
              }`}>Events</span>
            </button>
            
            <button 
              onClick={() => router.push('/devotions')}
              className="flex flex-col items-center justify-center"
            >
              <BookOpen className={`h-5 w-5 ${
                pathname === '/devotions' ? 'text-primary' : 'text-gray-500'
              }`} />
              <span className={`mt-1 text-xs ${
                pathname === '/devotions' ? 'text-primary font-medium' : 'text-gray-500'
              }`}>Devotions</span>
            </button>
            
            <button 
              onClick={() => router.push('/community')}
              className="flex flex-col items-center justify-center"
            >
              <Users className={`h-5 w-5 ${
                pathname === '/community' ? 'text-primary' : 'text-gray-500'
              }`} />
              <span className={`mt-1 text-xs ${
                pathname === '/community' ? 'text-primary font-medium' : 'text-gray-500'
              }`}>Community</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 