import { Context } from 'telegraf';
import { MESSAGES } from '../config/constants';
import { mainMenuKeyboard, cancelKeyboard } from '../utils/keyboard';
import { BotSession } from '../types';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

// Handle /login command - initiate login process
export const loginCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Clear any existing session data
    ctx.session = {};
    ctx.session.lastCommand = 'login';

    // Prompt for email
    await ctx.replyWithMarkdown(MESSAGES.LOGIN_PROMPT, cancelKeyboard());
  } catch (error) {
    console.error('Error in login command:', error);
    await ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

// Handle email input after login command
export const handleEmailInput = async (ctx: Context & { session: BotSession, message: any }) => {
  try {
    const email = ctx.message.text.trim();

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      await ctx.reply('Please enter a valid email address.');
      return;
    }

    // Store email in session
    ctx.session.tempData = { ...ctx.session.tempData, email };

    // Request OTP
    await authService.requestEmailOtp(email);
    
    // Update session state for OTP input
    ctx.session.lastCommand = 'login_otp';
    
    // Prompt for OTP
    await ctx.replyWithMarkdown(MESSAGES.OTP_SENT);
  } catch (error) {
    console.error('Error handling email input:', error);
    await ctx.reply('Error sending OTP. Please try again.');
    ctx.session.lastCommand = undefined;
  }
};

// Handle OTP input after email
export const handleOtpInput = async (ctx: Context & { session: BotSession, message: any }) => {
  try {
    const otp = ctx.message.text.trim();
    const email = ctx.session.tempData?.email;

    if (!email) {
      await ctx.reply('Session expired. Please start login process again.');
      ctx.session.lastCommand = undefined;
      return;
    }

    // Authenticate with OTP
    const authResponse = await authService.authenticateWithOtp(email, otp);

    // Store auth data in session
    ctx.session.token = authResponse.token;
    ctx.session.refreshToken = authResponse.refreshToken;
    ctx.session.user = authResponse.user;
    ctx.session.organizationId = authResponse.user.organizationId;
    
    // Clean up temp data
    ctx.session.tempData = {};
    ctx.session.lastCommand = undefined;

    // Setup notification service for deposits if user is authenticated
    if (ctx.session.token && ctx.session.organizationId) {
      await notificationService.setup(
        ctx.session.token,
        ctx.session.organizationId,
        (data) => {
          ctx.replyWithMarkdown(
            MESSAGES.DEPOSIT_NOTIFICATION(data.amount, data.network)
          );
        }
      );
    }

    // Send success message and show main menu
    await ctx.replyWithMarkdown(MESSAGES.LOGIN_SUCCESS);
    await ctx.reply('What would you like to do?', mainMenuKeyboard());
  } catch (error) {
    console.error('Error handling OTP input:', error);
    await ctx.reply('Invalid OTP or authentication error. Please try again.');
    ctx.session.lastCommand = undefined;
  }
};

// Handle login button callback
export const handleLoginCallback = async (ctx: Context & { session: BotSession }) => {
  try {
    // Clear any existing session data
    ctx.session = {};
    ctx.session.lastCommand = 'login';

    // Prompt for email
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(MESSAGES.LOGIN_PROMPT, cancelKeyboard());
  } catch (error) {
    console.error('Error in login callback:', error);
    await ctx.reply('Sorry, something went wrong. Please try again.');
  }
}; 