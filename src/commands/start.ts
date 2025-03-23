import { Context } from 'telegraf';
import { MESSAGES } from '../config/constants';
import { mainMenuKeyboard, loginKeyboard } from '../utils/keyboard';
import { BotSession } from '../types';

// Handle /start command - welcome users and show main options
export const startCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    await ctx.replyWithMarkdown(MESSAGES.WELCOME);
    
    // If user is already logged in, show main menu
    if (ctx.session.token) {
      await ctx.reply('What would you like to do?', mainMenuKeyboard());
    } else {
      // If not logged in, show login button
      await ctx.reply('Please login to continue', loginKeyboard());
    }
  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply('Sorry, something went wrong. Please try again.');
  }
}; 