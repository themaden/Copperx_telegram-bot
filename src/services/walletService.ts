import apiClient from '../api/api';
import { Wallet, Balance } from '../types';

export const walletService = {
  // Get all wallets
  async getWallets(): Promise<{ items: Wallet[] }> {
    try {
      const response = await apiClient.get<{ items: Wallet[] }>('/api/wallets');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get wallet balances
  async getBalances(): Promise<{ items: Balance[] }> {
    try {
      const response = await apiClient.get<{ items: Balance[] }>('/api/wallets/balances');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Set default wallet
  async setDefaultWallet(walletId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>('/api/wallets/default', { walletId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get default wallet
  async getDefaultWallet(): Promise<Wallet> {
    try {
      const response = await apiClient.get<Wallet>('/api/wallets/default');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default walletService; 