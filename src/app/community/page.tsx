'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Users } from 'lucide-react';
import { getUserName } from '@/utils/auth';

export default function CommunityPage() {
  const [loading, setLoading] = useState(true);
  const userName = getUserName();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <div className="p-2 bg-purple-50 rounded-full">
            <Users className="h-6 w-6 text-purple-500" />
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Welcome to our church community section, {userName}. This is where you can connect with other members
          and participate in community activities.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The community features are currently under development. 
                  Stay tuned for exciting new ways to connect with your church family!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Upcoming Member Spotlights</h2>
            <p className="text-gray-600 text-sm">Member spotlights will feature different members of our church community.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Prayer Requests</h2>
            <p className="text-gray-600 text-sm">Share and respond to prayer requests from the community.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 