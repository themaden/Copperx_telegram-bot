import apiClient from '../api/api';
import { AuthResponse, User } from '../types';

export const authService = {
  // Request email OTP
  async requestEmailOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/auth/email-otp/request', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Authenticate with email OTP
  async authenticateWithOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/email-otp/authenticate', { email, otp });
      
      // Set token in ApiClient
      if (response.token) {
        apiClient.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/api/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get KYC status
  async getKycStatus(): Promise<{ items: Array<{ id: string; status: string; type: string }> }> {
    try {
      const response = await apiClient.get<{ items: Array<{ id: string; status: string; type: string }> }>('/api/kycs');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout(): void {
    apiClient.clearToken();
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!apiClient['token']; // Accessing private property, use carefully
  }
};

export default authService; 