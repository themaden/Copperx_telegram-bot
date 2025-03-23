// Bot messages
export const MESSAGES = {
  WELCOME: `
👋 *Welcome to Copperx Bot*!

I can help you manage your stablecoin wallet, make transfers, and track your transactions.

To get started, use the /login command to connect your Copperx account.
  `,
  
  LOGIN_PROMPT: `
Please enter your email address to receive a one-time password:
  `,
  
  OTP_SENT: `
✅ OTP has been sent to your email. 

Please enter the verification code:
  `,
  
  LOGIN_SUCCESS: `
🎉 *Login successful!* 

You're now connected to your Copperx account. Use the buttons below to navigate.
  `,
  
  LOGOUT_SUCCESS: `
👋 You've been logged out of your Copperx account.

Use /login to reconnect anytime.
  `,
  
  UNAUTHORIZED: `
⚠️ You need to login first to use this feature.

Use /login to connect your Copperx account.
  `,
  
  KYC_REQUIRED: `
⚠️ Your KYC verification is not approved yet. 

Please complete your verification on the Copperx platform to use all features.
  `,
  
  BALANCE_HEADER: `
💰 *Your Wallet Balances:*
  `,
  
  NO_WALLETS: `
You don't have any wallets yet. 

Visit the Copperx platform to create a wallet.
  `,
  
  TRANSACTION_HISTORY_HEADER: `
📝 *Your Recent Transactions:*
  `,
  
  NO_TRANSACTIONS: `
You don't have any transactions yet.
  `,
  
  SEND_INSTRUCTIONS: `
💸 *Send Funds*

Please select how you would like to send funds:
  `,
  
  SEND_EMAIL_PROMPT: `
📧 *Send to Email*

Please enter the recipient's email address:
  `,
  
  SEND_WALLET_PROMPT: `
👛 *Send to Wallet*

Please enter the recipient's wallet address:
  `,
  
  WITHDRAW_BANK_PROMPT: `
🏦 *Withdraw to Bank*

Please enter your bank account ID:
  `,
  
  AMOUNT_PROMPT: `
Please enter the amount to send:
  `,
  
  SEND_SUCCESS: `
✅ *Transaction Initiated*

Your transaction has been successfully initiated. Use /history to check its status.
  `,
  
  TRANSACTION_ERROR: `
❌ *Transaction Failed*

There was an error processing your transaction. Please try again later.
  `,
  
  HELP: `
🤖 *Copperx Bot Help*

Here are the commands you can use:

/start - Begin using the bot
/login - Connect to your Copperx account
/profile - View your profile info
/balance - Check your wallet balances
/wallets - Manage your wallets
/setdefault - Set your default wallet
/send - Send funds to others
/withdraw - Withdraw to your bank
/history - View transaction history
/help - Show this help message
/logout - Disconnect your account

Need more help? Contact Copperx support!
  `,
  
  OPERATION_CANCELED: `
❌ Operation canceled. Return to main menu.
  `,
  
  DEPOSIT_NOTIFICATION: (amount: string, network: string) => `
💰 *New Deposit Received*

${amount} USDC deposited on ${network}
  `
};

// Command list for BotFather
export const COMMANDS = [
  { command: 'start', description: 'Start the bot and get welcome message' },
  { command: 'login', description: 'Login to your Copperx account' },
  { command: 'profile', description: 'View your profile' },
  { command: 'balance', description: 'Check your wallet balances' },
  { command: 'wallets', description: 'View all your wallets' },
  { command: 'setdefault', description: 'Set default wallet' },
  { command: 'send', description: 'Send funds to an email or wallet address' },
  { command: 'withdraw', description: 'Withdraw funds to bank account' },
  { command: 'history', description: 'View transaction history' },
  { command: 'help', description: 'Get help information' },
  { command: 'logout', description: 'Logout from your account' }
];

// Session key for storing user data
export const SESSION_KEY = 'session';

// Transaction types
export const TRANSACTION_TYPES = {
  EMAIL: 'email',
  WALLET: 'wallet',
  BANK: 'bank'
}; 