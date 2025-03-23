import { Telegraf, Context, session } from 'telegraf';
import dotenv from 'dotenv';
import { BotSession } from './types';
import { SESSION_KEY, COMMANDS } from './config/constants';
import authService from './services/authService';

// Import command handlers
import { startCommand } from './commands/start';
import { 
  loginCommand, 
  handleEmailInput, 
  handleOtpInput, 
  handleLoginCallback 
} from './commands/login';
import { requireAuth, balanceCommand } from './commands/balance';
import { walletsCommand, setDefaultCommand, handleSetDefaultCallback } from './commands/wallets';
import { 
  sendCommand, 
  handleSendEmailCallback, 
  handleSendWalletCallback, 
  handleWithdrawBankCallback,
  handleEmailRecipientInput,
  handleWalletAddressInput,
  handleBankAccountInput,
  handleAmountInput,
  handleTransactionConfirm,
  handleTransactionCancel
} from './commands/send';
import { historyCommand } from './commands/history';
import { profileCommand, logoutCommand, helpCommand } from './commands/profile';

// Load environment variables
dotenv.config();

// Telegram bot starts here
console.log("\n🤖 Copperx Telegram Bot başlatılıyor...\n");

// Choose between real bot or mock bot based on environment
const bot = new Telegraf<any>(process.env.BOT_TOKEN || '');

// Set bot commands for BotFather
bot.telegram.setMyCommands(COMMANDS);

// Use session middleware
bot.use(session());

// Initialize session
bot.use((ctx: any, next: () => Promise<void>) => {
  // Ensure session exists
  if (!ctx.session) {
    ctx.session = {};
  }
  
  // Initialize bot session if not exists
  if (!ctx.session[SESSION_KEY]) {
    ctx.session[SESSION_KEY] = {};
  }
  
  // Make session directly available
  ctx.session = ctx.session[SESSION_KEY] as BotSession;
  
  return next();
});

// Handle commands
bot.command('start', (ctx: any) => startCommand(ctx));
bot.command('login', (ctx: any) => loginCommand(ctx));
bot.command('balance', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => balanceCommand(ctx));
bot.command('wallets', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => walletsCommand(ctx));
bot.command('setdefault', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => setDefaultCommand(ctx));
bot.command('send', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => sendCommand(ctx));
bot.command('history', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => historyCommand(ctx));
bot.command('profile', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => profileCommand(ctx));
bot.command('logout', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => logoutCommand(ctx));
bot.command('help', (ctx: any) => helpCommand(ctx));

// Handle callback queries
bot.action('login', (ctx: any) => handleLoginCallback(ctx));
bot.action(/setdefault:(.+)/, async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => handleSetDefaultCallback(ctx));
bot.action('send_email', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => handleSendEmailCallback(ctx));
bot.action('send_wallet', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => handleSendWalletCallback(ctx));
bot.action('withdraw_bank', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => handleWithdrawBankCallback(ctx));
bot.action(/confirm_(.+)/, async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => handleTransactionConfirm(ctx));
bot.action('cancel_transaction', async (ctx: any, next: any) => {
  await requireAuth(ctx, next);
}, (ctx: any) => handleTransactionCancel(ctx));
bot.action('back_to_main', (ctx: any) => {
  ctx.answerCbQuery();
  startCommand(ctx);
});
bot.action('back_to_wallets', (ctx: any) => {
  ctx.answerCbQuery();
  walletsCommand(ctx);
});

// Handle text messages - used for interactive flows
bot.on('text', async (ctx: any) => {
  // If cancel is requested, reset the session state
  if (ctx.message.text === '❌ Cancel') {
    ctx.session.lastCommand = undefined;
    await ctx.reply('Operation canceled.');
    await startCommand(ctx);
    return;
  }

  // If "Back to Main Menu" is requested
  if (ctx.message.text === '🔙 Back to Main Menu') {
    await startCommand(ctx);
    return;
  }

  // Handle commands based on last command state
  switch (ctx.session.lastCommand) {
    case 'login':
      await handleEmailInput(ctx);
      break;
    case 'login_otp':
      await handleOtpInput(ctx);
      break;
    case 'send_email_recipient':
      await handleEmailRecipientInput(ctx);
      break;
    case 'send_wallet_recipient':
      await handleWalletAddressInput(ctx);
      break;
    case 'send_bank_recipient':
      await handleBankAccountInput(ctx);
      break;
    case 'send_amount':
      await handleAmountInput(ctx);
      break;
    default:
      // Handle main menu button interactions
      if (ctx.message.text === '💼 Wallets') {
        await walletsCommand(ctx);
      } else if (ctx.message.text === '💰 Balance') {
        await balanceCommand(ctx);
      } else if (ctx.message.text === '💸 Send') {
        await sendCommand(ctx);
      } else if (ctx.message.text === '📝 History') {
        await historyCommand(ctx);
      } else if (ctx.message.text === '👤 Profile') {
        await profileCommand(ctx);
      } else if (ctx.message.text === '❓ Help') {
        await helpCommand(ctx);
      }
      break;
  }
});

// Handle errors
bot.catch((err: unknown, ctx: any) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('An error occurred. Please try again later.');
});

// Start the bot
bot.launch().then(() => {
  console.log('Bot started successfully!');
}).catch((err: Error) => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 