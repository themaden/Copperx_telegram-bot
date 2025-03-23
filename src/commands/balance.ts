import { Context } from 'telegraf';
import { MESSAGES } from '../config/constants';
import { mainMenuKeyboard, balanceKeyboard } from '../utils/keyboard';
import { BotSession } from '../types';
import walletService from '../services/walletService';
import authService from '../services/authService';
import { formatAmount } from '../utils/formatters';

// Middleware to check if user is authenticated
export const requireAuth = async (ctx: Context & { session: BotSession }, next: () => Promise<void>) => {
  if (!authService.isAuthenticated()) {
    await ctx.replyWithMarkdown(MESSAGES.UNAUTHORIZED);
    return;
  }
  await next();
};

// Handle /balance command - show all wallet balances
export const balanceCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Get wallet balances from API
    const { items: balances } = await walletService.getBalances();

    if (!balances || balances.length === 0) {
      await ctx.replyWithMarkdown(MESSAGES.NO_WALLETS);
      return;
    }

    // Prepare balance message
    let balanceMessage = MESSAGES.BALANCE_HEADER + '\n\n';
    
    balances.forEach((balance, index) => {
      balanceMessage += `*${index + 1}. ${balance.walletName} (${balance.network})*\n`;
      balanceMessage += `💵 ${formatAmount(balance.balance, balance.currencyCode)}\n\n`;
    });

    // Send message with balance keyboard
    await ctx.replyWithMarkdown(balanceMessage, balanceKeyboard(balances));
  } catch (error) {
    console.error('Error in balance command:', error);
    await ctx.reply('Unable to fetch balances. Please try again later.');
  }
}; 