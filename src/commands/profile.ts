import { Context } from 'telegraf';
import { MESSAGES } from '../config/constants';
import { mainMenuKeyboard } from '../utils/keyboard';
import { BotSession } from '../types';
import authService from '../services/authService';
import { formatKycStatus } from '../utils/formatters';

// Handle /profile command - show user profile information
export const profileCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Get user profile and KYC status
    const profile = await authService.getProfile();
    const { items: kycs } = await authService.getKycStatus();

    // Prepare profile message
    let profileMessage = '👤 *Your Profile*\n\n';
    profileMessage += `*Name*: ${profile.firstName} ${profile.lastName}\n`;
    profileMessage += `*Email*: ${profile.email}\n`;
    profileMessage += `*Status*: ${profile.status}\n`;
    profileMessage += `*Role*: ${profile.role}\n\n`;
    
    // Add KYC information if available
    if (kycs && kycs.length > 0) {
      profileMessage += '*Verification Status:*\n';
      
      kycs.forEach(kyc => {
        profileMessage += `${formatKycStatus(kyc.status)} ${kyc.type.toUpperCase()}\n`;
      });
    }

    // Send message with main menu keyboard
    await ctx.replyWithMarkdown(profileMessage, mainMenuKeyboard());
  } catch (error) {
    console.error('Error in profile command:', error);
    await ctx.reply('Unable to fetch profile information. Please try again later.');
  }
};

// Handle /logout command - log out the user
export const logoutCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Disconnect notification service
    if (ctx.session.token && ctx.session.organizationId) {
      const notificationService = await import('../services/notificationService');
      notificationService.default.disconnect();
    }
    
    // Clear session data
    ctx.session = {};
    
    // Logout from API
    authService.logout();
    
    // Send logout message
    await ctx.replyWithMarkdown(MESSAGES.LOGOUT_SUCCESS);
  } catch (error) {
    console.error('Error in logout command:', error);
    await ctx.reply('Error logging out. Please try again.');
  }
};

// Handle /help command - show bot help information
export const helpCommand = async (ctx: Context) => {
  try {
    await ctx.replyWithMarkdown(MESSAGES.HELP, mainMenuKeyboard());
  } catch (error) {
    console.error('Error in help command:', error);
    await ctx.reply('Error displaying help information.');
  }
}; 