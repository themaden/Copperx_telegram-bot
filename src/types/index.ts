// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: string;
  status: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Wallet related types
export interface Wallet {
  id: string;
  name: string;
  address: string;
  network: string;
  isDefault: boolean;
  currencyCode: string;
  currencyId: string;
}

export interface Balance {
  walletId: string;
  walletName: string;
  walletAddress: string;
  network: string;
  currencyCode: string;
  balance: string;
  currencyId: string;
}

// Transaction related types
export interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: string;
  fee: string;
  totalAmount: string;
  currencyCode: string;
  createdAt: string;
  from?: {
    address: string;
    name?: string;
  };
  to?: {
    address: string;
    name?: string;
  };
}

// KYC related types
export interface KYC {
  id: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
  error?: string;
}

// Bot session type
export interface BotSession {
  token?: string;
  refreshToken?: string;
  user?: User;
  organizationId?: string;
  lastCommand?: string;
  tempData?: Record<string, any>;
}

// Notification types
export interface DepositNotification {
  amount: string;
  network: string;
  txHash: string;
  currencyCode: string;
  createdAt: string;
} 