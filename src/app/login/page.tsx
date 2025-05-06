'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { loginUseCase } from '@/useCases/auth/loginUseCase';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import { storeUserInfo } from '@/utils/auth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the loginUseCase which already handles store updates
      const response = await loginUseCase(formData);
      
      if (response.success) {
        // Ensure user data is properly stored in both localStorage and store
        if (response.data) {
          storeUserInfo(response.data);
          console.log('Login successful, user stored:', response.data.user.name);
        }
        
        // The loginUseCase already updates the store and shows success toast
        router.push('/home');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if authenticated
  if (isAuthenticated) {
    router.replace('/home');
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 mb-4">
              <Image 
                src="/images/shepherd-logo.png" 
                alt="Shepherd Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-center text-gray-600">Sign in to continue to Shepherd Dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right Side - Banner */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark">
        <div className="flex flex-col justify-center items-center h-full text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Shepherd Dashboard</h2>
          <p className="text-xl max-w-md text-center mb-8">
            Your complete church management solution. Sign in to access all features and manage your church events.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Church Events</h3>
              <p className="text-sm opacity-80">Manage and organize all your church events in one place.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Devotions</h3>
              <p className="text-sm opacity-80">Access daily devotions and spiritual content.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm opacity-80">Connect with your church community.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Worship</h3>
              <p className="text-sm opacity-80">Access worship materials and schedules.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 