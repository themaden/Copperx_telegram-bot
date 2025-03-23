// Format a date string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format an amount with currency code
export const formatAmount = (amount: string, currencyCode: string): string => {
  // Convert to number, format with 2 decimal places, and add currency code
  const numAmount = parseFloat(amount);
  return `${numAmount.toFixed(2)} ${currencyCode}`;
};

// Format transaction status with emoji
export const formatTransactionStatus = (status: string): string => {
  const statusEmojis: Record<string, string> = {
    'completed': '✅',
    'pending': '⏳',
    'failed': '❌',
    'processing': '🔄',
    'canceled': '🚫'
  };

  const emoji = statusEmojis[status.toLowerCase()] || '❓';
  return `${emoji} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
};

// Format transaction type with emoji
export const formatTransactionType = (type: string): string => {
  const typeEmojis: Record<string, string> = {
    'deposit': '⬇️',
    'withdrawal': '⬆️',
    'transfer': '↔️',
    'email': '📧',
    'wallet': '👛',
    'bank': '🏦'
  };

  const emoji = typeEmojis[type.toLowerCase()] || '🔄';
  return `${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
};

// Format wallet address (truncate for display)
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Escape special characters in Markdown
export const escapeMarkdown = (text: string): string => {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
};

// Format KYC status with emoji
export const formatKycStatus = (status: string): string => {
  const statusEmojis: Record<string, string> = {
    'approved': '✅',
    'pending': '⏳',
    'rejected': '❌',
    'not_submitted': '📝'
  };

  const emoji = statusEmojis[status.toLowerCase()] || '❓';
  return `${emoji} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
}; 