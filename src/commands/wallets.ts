import { Context } from 'telegraf';
import { MESSAGES } from '../config/constants';
import { walletsKeyboard, setDefaultWalletKeyboard } from '../utils/keyboard';
import { BotSession, Wallet } from '../types';
import walletService from '../services/walletService';
import { formatWalletAddress } from '../utils/formatters';

// Handle /wallets command - show all wallets
export const walletsCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Get wallets from API
    const { items: wallets } = await walletService.getWallets();

    if (!wallets || wallets.length === 0) {
      await ctx.replyWithMarkdown(MESSAGES.NO_WALLETS);
      return;
    }

    // Prepare wallet list message
    let walletsMessage = '💼 *Your Wallets:*\n\n';
    
    wallets.forEach((wallet, index) => {
      const defaultTag = wallet.isDefault ? ' *(Default)*' : '';
      walletsMessage += `*${index + 1}. ${wallet.name}${defaultTag}*\n`;
      walletsMessage += `🌐 Network: ${wallet.network}\n`;
      walletsMessage += `💲 Currency: ${wallet.currencyCode}\n`;
      walletsMessage += `📇 Address: \`${formatWalletAddress(wallet.address)}\`\n\n`;
    });

    // Send message with wallets keyboard
    await ctx.replyWithMarkdown(walletsMessage, walletsKeyboard(wallets));
  } catch (error) {
    console.error('Error in wallets command:', error);
    await ctx.reply('Unable to fetch wallets. Please try again later.');
  }
};

// Handle /setdefault command - show wallet selection for setting default
export const setDefaultCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Get wallets from API
    const { items: wallets } = await walletService.getWallets();

    if (!wallets || wallets.length === 0) {
      await ctx.replyWithMarkdown(MESSAGES.NO_WALLETS);
      return;
    }

    // Send message with wallets selection keyboard
    await ctx.replyWithMarkdown(
      '🔄 *Set Default Wallet*\n\nSelect the wallet you want to set as default:',
      setDefaultWalletKeyboard(wallets)
    );
  } catch (error) {
    console.error('Error in setdefault command:', error);
    await ctx.reply('Unable to fetch wallets. Please try again later.');
  }
};

// Handle set default wallet callback
export const handleSetDefaultCallback = async (ctx: Context & { session: BotSession, match?: any }) => {
  try {
    // Extract wallet ID from callback data
    const walletId = ctx.match?.[1];
    
    if (!walletId) {
      await ctx.answerCbQuery('Invalid wallet selection');
      return;
    }

    // Call API to set default wallet
    const response = await walletService.setDefaultWallet(walletId);
    
    // Answer callback query
    await ctx.answerCbQuery('Default wallet updated');
    
    // Show updated wallets list
    await walletsCommand(ctx);
  } catch (error) {
    console.error('Error setting default wallet:', error);
    await ctx.answerCbQuery('Error setting default wallet');
  }
}; 