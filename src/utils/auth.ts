import { useAuthStore } from '../store/authStore';
import { LoginResponseData } from '../types/api';

// Function to initialize the auth store from localStorage
export const initAuthFromStorage = (): void => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  try {
    const token = localStorage.getItem('accessToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      const user = JSON.parse(userInfo);
      
      // Set auth state in the store with proper structure
      useAuthStore.getState().setUser({
        accessToken: token,
        user: user // Pass the entire user object
      });
      
      console.log('Auth store initialized with user:', user.name);
    }
  } catch (error) {
    console.error('Error initializing auth from storage:', error);
    // Clear potentially corrupted data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    useAuthStore.getState().clearUser();
  }
};

// Function to get user name safely from store or localStorage
export const getUserName = (): string => {
  // First try to get from store
  const userData = useAuthStore.getState().user;
  if (userData?.user?.name) {
    return userData.user.name;
  }
  
  // Fallback to localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return user.name || 'User';
      }
    } catch (error) {
      console.error('Error getting user name from localStorage:', error);
    }
  }
  
  return 'User';
};

// Function to safely store user info in both localStorage and store
export const storeUserInfo = (userData: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Extract the accessToken from userData
    const accessToken = userData.accessToken;
    
    // Update localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    
    // Update store with proper structure
    useAuthStore.getState().setUser({
      accessToken: accessToken,
      user: userData
    });
    
    console.log('User info stored successfully:', userData.name);
  } catch (error) {
    console.error('Error storing user info:', error);
  }
};

// Function to clear user info from both localStorage and store
export const clearUserInfo = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userInfo');
  useAuthStore.getState().clearUser();
}; 