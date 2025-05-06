import { authService } from '../../services/api';
import { LoginCredentials } from '../../types/api';
import { toast } from 'react-hot-toast';
import { storeUserInfo } from '../../utils/auth';

export const loginUseCase = async (credentials: LoginCredentials) => {
  try {
    const response = await authService.login(credentials);
    if (response.success) {
      storeUserInfo(response.data);
      toast.success(response.message || 'Login successful!');
    }
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    toast.error(errorMessage);
    throw error;
  }
}; 