'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { 
  LogOut, 
  Calendar, 
  BookOpen, 
  Users, 
  Bell, 
  Settings, 
  Home, 
  ChevronRight, 
  FileText,
  Bookmark
} from 'lucide-react';
import { getUserName } from '@/utils/auth';

export default function HomePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Get auth state from store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  // Get user name using our utility function
  const userName = getUserName();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    console.log("Home page - current user:", userName);
  }, [userName]);

  // Immediate check for token
  useEffect(() => {
    // Check directly for token existence
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // No token found, redirect immediately
        console.log('No token found in home page, redirecting to login');
        router.replace('/login');
        return;
      }
      setIsClient(true);
    }
  }, [router]);

  // Skip rendering until client-side check completes
  if (!isClient) {
    return null;
  }

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

  // Only show page content if authenticated
  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

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
        <nav className="mt-6 px-4 flex-1">
          <div className="space-y-1">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'dashboard' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button 
              onClick={() => handleNavigation('/church-events')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'events' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Church Events
            </button>
            <button 
              onClick={() => handleNavigation('/devotions')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'devotions' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Devotions
            </button>
            <button 
              onClick={() => setCurrentTab('community')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'community' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Community
            </button>
          </div>
        </nav>
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
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  {userName.charAt(0)}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{greeting}, {userName}!</h2>
            <p className="mt-2 text-gray-600">Here's what's happening with your church today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Next event in 2 days</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Today's Devotion</h3>
                <div className="p-2 bg-green-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <p className="mt-2 text-lg font-medium text-gray-900">Faith in Action</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>James 2:14-26</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Community</h3>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">42</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Active members</span>
              </div>
            </div>
          </div>

          {/* Feature Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Events Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
                <button 
                  onClick={() => handleNavigation('/church-events')}
                  className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Event Item */}
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 text-center w-12">
                      <div className="text-xs font-medium text-blue-800">MAY</div>
                      <div className="text-lg font-bold text-blue-800">15</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Sunday Service</h4>
                      <p className="text-xs text-gray-500">10:00 AM - Main Hall</p>
                    </div>
                  </div>
                  
                  {/* Event Item */}
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 text-center w-12">
                      <div className="text-xs font-medium text-blue-800">MAY</div>
                      <div className="text-lg font-bold text-blue-800">17</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Prayer Meeting</h4>
                      <p className="text-xs text-gray-500">7:00 PM - Prayer Room</p>
                    </div>
                  </div>
                  
                  {/* Event Item */}
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 text-center w-12">
                      <div className="text-xs font-medium text-blue-800">MAY</div>
                      <div className="text-lg font-bold text-blue-800">20</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">Youth Gathering</h4>
                      <p className="text-xs text-gray-500">6:30 PM - Fellowship Hall</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Devotions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Recent Devotions</h3>
                <button 
                  onClick={() => handleNavigation('/devotions')}
                  className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Devotion Item */}
                  <div className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 text-green-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">Faith in Action</h4>
                      <p className="text-xs text-gray-500">James 2:14-26 • May 14, 2023</p>
                    </div>
                    <div className="ml-auto">
                      <button className="p-1 text-gray-400 hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Devotion Item */}
                  <div className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 text-green-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">The Good Shepherd</h4>
                      <p className="text-xs text-gray-500">John 10:1-18 • May 13, 2023</p>
                    </div>
                    <div className="ml-auto">
                      <button className="p-1 text-gray-400 hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Devotion Item */}
                  <div className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 text-green-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">Fruits of the Spirit</h4>
                      <p className="text-xs text-gray-500">Galatians 5:22-23 • May 12, 2023</p>
                    </div>
                    <div className="ml-auto">
                      <button className="p-1 text-gray-400 hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 h-16">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className="flex flex-col items-center justify-center"
          >
            <Home className={`h-5 w-5 ${currentTab === 'dashboard' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`mt-1 text-xs ${currentTab === 'dashboard' ? 'text-primary font-medium' : 'text-gray-500'}`}>Home</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/church-events')}
            className="flex flex-col items-center justify-center"
          >
            <Calendar className={`h-5 w-5 ${currentTab === 'events' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`mt-1 text-xs ${currentTab === 'events' ? 'text-primary font-medium' : 'text-gray-500'}`}>Events</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/devotions')}
            className="flex flex-col items-center justify-center"
          >
            <BookOpen className={`h-5 w-5 ${currentTab === 'devotions' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`mt-1 text-xs ${currentTab === 'devotions' ? 'text-primary font-medium' : 'text-gray-500'}`}>Devotions</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('community')}
            className="flex flex-col items-center justify-center"
          >
            <Users className={`h-5 w-5 ${currentTab === 'community' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`mt-1 text-xs ${currentTab === 'community' ? 'text-primary font-medium' : 'text-gray-500'}`}>Community</span>
          </button>
        </div>
      </div>
    </div>
  );
} 