import { Context } from 'telegraf';
import { MESSAGES } from '../config/constants';
import { BotSession } from '../types';
import transferService from '../services/transferService';
import { formatDate, formatAmount, formatTransactionStatus, formatTransactionType } from '../utils/formatters';
import { mainMenuKeyboard } from '../utils/keyboard';

// Handle /history command - show recent transactions
export const historyCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Get transactions (first page, 10 items)
    const { items: transactions } = await transferService.getTransactions(1, 10);

    if (!transactions || transactions.length === 0) {
      await ctx.replyWithMarkdown(MESSAGES.NO_TRANSACTIONS, mainMenuKeyboard());
      return;
    }

    // Prepare transaction history message
    let historyMessage = MESSAGES.TRANSACTION_HISTORY_HEADER + '\n\n';
    
    transactions.forEach((tx, index) => {
      historyMessage += `*${index + 1}. ${formatTransactionType(tx.type)}*\n`;
      historyMessage += `Status: ${formatTransactionStatus(tx.status)}\n`;
      historyMessage += `Amount: ${formatAmount(tx.amount, tx.currencyCode)}\n`;
      historyMessage += `Date: ${formatDate(tx.createdAt)}\n`;
      
      // Add sender/recipient info if available
      if (tx.from?.address) {
        const fromName = tx.from.name ? `(${tx.from.name})` : '';
        historyMessage += `From: ${tx.from.address} ${fromName}\n`;
      }
      
      if (tx.to?.address) {
        const toName = tx.to.name ? `(${tx.to.name})` : '';
        historyMessage += `To: ${tx.to.address} ${toName}\n`;
      }
      
      historyMessage += '\n';
    });

    // Send message with main menu keyboard
    await ctx.replyWithMarkdown(historyMessage, mainMenuKeyboard());
  } catch (error) {
    console.error('Error in history command:', error);
    await ctx.reply('Unable to fetch transaction history. Please try again later.');
  }
}; 