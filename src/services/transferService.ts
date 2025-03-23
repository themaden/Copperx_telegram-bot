import apiClient from '../api/api';
import { Transaction } from '../types';

export const transferService = {
  // Get transaction history
  async getTransactions(page: number = 1, limit: number = 10): Promise<{ items: Transaction[], total: number }> {
    try {
      const response = await apiClient.get<{ items: Transaction[], total: number }>('/api/transfers', { page, limit });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send funds to email
  async sendToEmail(
    email: string,
    amount: string,
    currencyId: string
  ): Promise<{ id: string; message: string }> {
    try {
      const response = await apiClient.post<{ id: string; message: string }>('/api/transfers/send', {
        email,
        amount,
        currencyId
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send funds to wallet address
  async sendToWallet(
    address: string,
    amount: string,
    currencyId: string,
    network: string
  ): Promise<{ id: string; message: string }> {
    try {
      const response = await apiClient.post<{ id: string; message: string }>('/api/transfers/wallet-withdraw', {
        address,
        amount,
        currencyId,
        network
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Withdraw funds to bank
  async withdrawToBank(
    amount: string,
    currencyId: string,
    bankAccountId: string
  ): Promise<{ id: string; message: string }> {
    try {
      const response = await apiClient.post<{ id: string; message: string }>('/api/transfers/offramp', {
        amount,
        currencyId,
        bankAccountId
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction details
  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<Transaction>(`/api/transfers/${transactionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default transferService; 