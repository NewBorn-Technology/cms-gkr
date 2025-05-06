'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, LogOut, Calendar, BookOpen } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignOut = () => {
    logout();
    window.location.href = '/login';
  };

  const handleNavigation = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sign Out Button - Only visible when authenticated */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-primary">Shepherd Dashboard</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your complete church management solution. Sign in to access all features and manage your church events.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            {!isAuthenticated && (
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:scale-105 transition-all duration-200 ease-in-out group"
              >
                Sign In
                <ArrowRight className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-12">
          <div className="rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="text-center">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900">Church Events</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Manage and organize all your church events in one place.
                    </p>
                    <button
                      onClick={() => handleNavigation('/church-events')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Events
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900">Devotions</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Access daily devotions and spiritual content.
                    </p>
                    <button
                      onClick={() => handleNavigation('/devotions')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Devotions
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900">Community</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Connect with your church community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 