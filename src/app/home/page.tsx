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
  Bookmark,
  ArrowRight,
  Trophy,
  Crown,
  User
} from 'lucide-react';
import { getUserName } from '@/utils/auth';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface UserProgressDto {
  userId: number;
  name: string;
  progressPercent: number;
}

export default function HomePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [topUsers, setTopUsers] = useState<UserProgressDto[]>([]);
  
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

    // Fetch top 3 leaderboard users
    const fetchTopUsers = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const res = await axios.get("https://api-shepherd.jar-vis.com/api/v1/summa-logos/users-progress", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setTopUsers(res.data.data.slice(0, 3));
      } catch (err) {
        setTopUsers([]);
      }
    };
    fetchTopUsers();
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
      toast.error('You need to log in first');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }
  };

  // Only show page content if authenticated
  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r border-gray-200 fixed inset-y-0 left-0 z-40">
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
            <button
              onClick={() => handleNavigation('/leaderboard')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100`}
            >
              <Trophy className="mr-3 h-5 w-5 text-yellow-500" />
              Leaderboard
            </button>
          </div>
        </nav>
      </div>

      {/* Fixed Sign Out Button - Only visible when authenticated */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 w-64 p-4 bg-white border-t z-50">
          <button
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

            {/* Leaderboard Card as the last card */}
            {topUsers.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-xl p-4 shadow-md border border-yellow-100 flex flex-col items-start justify-between min-h-[120px] transition-all hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <Crown className="h-6 w-6 text-yellow-400 mr-2" />
                  <h3 className="text-base font-semibold text-gray-800">Top 3 Leaderboard</h3>
                </div>
                <div className="flex space-x-2 w-full justify-between">
                  {topUsers.map((user, idx) => (
                    <div key={user.userId} className="flex flex-col items-center min-w-[50px] max-w-[70px]">
                      <div className="relative mb-1">
                        {idx < 3 && (
                          <Crown className={`absolute -top-3 left-1/2 -translate-x-1/2 h-4 w-4 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : 'text-orange-400'}`} />
                        )}
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-base font-bold shadow">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-gray-900 truncate max-w-[60px] text-center">{user.name}</div>
                      <div className="text-[10px] font-bold text-primary mt-1">{user.progressPercent.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feature Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Events Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">Upcoming Events</h3>
                <button
                  onClick={() => handleNavigation('/church-events')}
                  className="text-primary hover:text-primary-dark text-xs font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="px-4 py-2">
                <div className="space-y-2">
                  {/* Event Item */}
                  <div className="flex items-start py-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-1 text-center w-10">
                      <div className="text-[10px] font-medium text-blue-800">MAY</div>
                      <div className="text-base font-bold text-blue-800">15</div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Sunday Service</h4>
                      <p className="text-xs text-gray-500">10:00 AM - Main Hall</p>
                    </div>
                  </div>
                  
                  {/* Event Item */}
                  <div className="flex items-start py-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-1 text-center w-10">
                      <div className="text-[10px] font-medium text-blue-800">MAY</div>
                      <div className="text-base font-bold text-blue-800">17</div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Prayer Meeting</h4>
                      <p className="text-xs text-gray-500">7:00 PM - Prayer Room</p>
                    </div>
                  </div>
                  
                  {/* Event Item */}
                  <div className="flex items-start py-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-1 text-center w-10">
                      <div className="text-[10px] font-medium text-blue-800">MAY</div>
                      <div className="text-base font-bold text-blue-800">20</div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Youth Gathering</h4>
                      <p className="text-xs text-gray-500">6:30 PM - Fellowship Hall</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Devotions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">Recent Devotions</h3>
                <button
                  onClick={() => handleNavigation('/devotions')}
                  className="text-primary hover:text-primary-dark text-xs font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="px-4 py-2">
                <div className="space-y-2">
                  {/* Devotion Item */}
                  <div className="group flex items-start py-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 text-green-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">Faith in Action</h4>
                      <p className="text-xs text-gray-500">James 2:14-26 • Monday, 14-05-2023</p>
                    </div>
                    <div className="ml-auto">
                      <button className="p-1 text-gray-400 hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Devotion Item */}
                  <div className="group flex items-start py-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 text-green-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary">The Good Shepherd</h4>
                      <p className="text-xs text-gray-500">John 10:1-18 • Sunday, 13-05-2023</p>
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