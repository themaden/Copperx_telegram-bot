import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { ApiError } from '../types';

dotenv.config();

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorResponse: ApiError = {
          message: error.response?.data?.message || 'An error occurred',
          status: error.response?.status || 500,
          error: error.response?.data?.error || error.message,
        };
        return Promise.reject(errorResponse);
      }
    );
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET request
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  // POST request
  async post<T>(url: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  // PUT request
  async put<T>(url: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  // DELETE request
  async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, params });
  }
}

export default new ApiClient(); 