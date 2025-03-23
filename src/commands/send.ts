import { Context } from 'telegraf';
import { MESSAGES, TRANSACTION_TYPES } from '../config/constants';
import { sendOptionsKeyboard, cancelKeyboard, confirmTransactionKeyboard, mainMenuKeyboard } from '../utils/keyboard';
import { BotSession } from '../types';
import transferService from '../services/transferService';
import walletService from '../services/walletService';

// Handle /send command - show transfer options
export const sendCommand = async (ctx: Context & { session: BotSession }) => {
  try {
    // Clear any existing session data
    ctx.session.tempData = {};
    
    // Show send options
    await ctx.replyWithMarkdown(
      MESSAGES.SEND_INSTRUCTIONS,
      sendOptionsKeyboard()
    );
  } catch (error) {
    console.error('Error in send command:', error);
    await ctx.reply('Sorry, something went wrong. Please try again.');
  }
};

// Handle send to email callback
export const handleSendEmailCallback = async (ctx: Context & { session: BotSession }) => {
  try {
    // Set session state
    ctx.session.lastCommand = 'send_email_recipient';
    ctx.session.tempData = { transactionType: TRANSACTION_TYPES.EMAIL };
    
    // Prompt for email
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(MESSAGES.SEND_EMAIL_PROMPT, cancelKeyboard());
  } catch (error) {
    console.error('Error handling send email callback:', error);
    await ctx.answerCbQuery('Error processing request');
  }
};

// Handle send to wallet callback
export const handleSendWalletCallback = async (ctx: Context & { session: BotSession }) => {
  try {
    // Set session state
    ctx.session.lastCommand = 'send_wallet_recipient';
    ctx.session.tempData = { transactionType: TRANSACTION_TYPES.WALLET };
    
    // Prompt for wallet address
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(MESSAGES.SEND_WALLET_PROMPT, cancelKeyboard());
  } catch (error) {
    console.error('Error handling send wallet callback:', error);
    await ctx.answerCbQuery('Error processing request');
  }
};

// Handle withdraw to bank callback
export const handleWithdrawBankCallback = async (ctx: Context & { session: BotSession }) => {
  try {
    // Set session state
    ctx.session.lastCommand = 'send_bank_recipient';
    ctx.session.tempData = { transactionType: TRANSACTION_TYPES.BANK };
    
    // Prompt for bank account ID
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(MESSAGES.WITHDRAW_BANK_PROMPT, cancelKeyboard());
  } catch (error) {
    console.error('Error handling withdraw bank callback:', error);
    await ctx.answerCbQuery('Error processing request');
  }
};

// Handle email recipient input
export const handleEmailRecipientInput = async (ctx: Context & { session: BotSession, message: any }) => {
  try {
    const email = ctx.message.text.trim();

    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      await ctx.reply('Please enter a valid email address.');
      return;
    }

    // Store recipient in session
    ctx.session.tempData = { ...ctx.session.tempData, recipient: email };
    
    // Ask for amount
    ctx.session.lastCommand = 'send_amount';
    await ctx.reply(MESSAGES.AMOUNT_PROMPT);
  } catch (error) {
    console.error('Error handling email recipient input:', error);
    await ctx.reply('Error processing input. Please try again.');
    ctx.session.lastCommand = undefined;
  }
};

// Handle wallet address input
export const handleWalletAddressInput = async (ctx: Context & { session: BotSession, message: any }) => {
  try {
    const address = ctx.message.text.trim();

    // Very basic validation - in real app you'd have more checks
    if (address.length < 10) {
      await ctx.reply('Please enter a valid wallet address.');
      return;
    }

    // Get default wallet to determine network
    const defaultWallet = await walletService.getDefaultWallet();
    
    // Store recipient and network in session
    ctx.session.tempData = { 
      ...ctx.session.tempData, 
      recipient: address,
      network: defaultWallet.network,
      currencyId: defaultWallet.currencyId
    };
    
    // Ask for amount
    ctx.session.lastCommand = 'send_amount';
    await ctx.reply(MESSAGES.AMOUNT_PROMPT);
  } catch (error) {
    console.error('Error handling wallet address input:', error);
    await ctx.reply('Error processing input. Please try again.');
    ctx.session.lastCommand = undefined;
  }
};

// Handle bank account input
export const handleBankAccountInput = async (ctx: Context & { session: BotSession, message: any }) => {
  try {
    const bankAccountId = ctx.message.text.trim();

    // Store recipient in session
    ctx.session.tempData = { ...ctx.session.tempData, recipient: bankAccountId };
    
    // Ask for amount
    ctx.session.lastCommand = 'send_amount';
    await ctx.reply(MESSAGES.AMOUNT_PROMPT);
  } catch (error) {
    console.error('Error handling bank account input:', error);
    await ctx.reply('Error processing input. Please try again.');
    ctx.session.lastCommand = undefined;
  }
};

// Handle amount input
export const handleAmountInput = async (ctx: Context & { session: BotSession, message: any }) => {
  try {
    const amount = ctx.message.text.trim();
    
    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      await ctx.reply('Please enter a valid amount (a positive number).');
      return;
    }

    // Get default wallet for currency
    const defaultWallet = await walletService.getDefaultWallet();
    
    // Store amount and currency in session
    ctx.session.tempData = { 
      ...ctx.session.tempData, 
      amount: amount.toString(),
      currencyId: ctx.session.tempData?.currencyId || defaultWallet.currencyId,
      currencyCode: defaultWallet.currencyCode
    };
    
    // Show confirmation
    ctx.session.lastCommand = 'confirm_transaction';
    
    let confirmationMsg = '📝 *Transaction Summary*\n\n';
    const transactionType = ctx.session.tempData?.transactionType;
    
    if (transactionType === TRANSACTION_TYPES.EMAIL) {
      confirmationMsg += `📧 Recipient: ${ctx.session.tempData?.recipient}\n`;
    } else if (transactionType === TRANSACTION_TYPES.WALLET) {
      confirmationMsg += `👛 Address: ${ctx.session.tempData?.recipient}\n`;
      confirmationMsg += `🌐 Network: ${ctx.session.tempData?.network}\n`;
    } else if (transactionType === TRANSACTION_TYPES.BANK) {
      confirmationMsg += `🏦 Bank Account: ${ctx.session.tempData?.recipient}\n`;
    }
    
    confirmationMsg += `💵 Amount: ${numAmount.toFixed(2)} ${ctx.session.tempData?.currencyCode}\n\n`;
    confirmationMsg += 'Please confirm this transaction:';
    
    await ctx.replyWithMarkdown(
      confirmationMsg,
      confirmTransactionKeyboard(ctx.session.tempData?.transactionType || '')
    );
  } catch (error) {
    console.error('Error handling amount input:', error);
    await ctx.reply('Error processing input. Please try again.');
    ctx.session.lastCommand = undefined;
  }
};

// Handle transaction confirmation
export const handleTransactionConfirm = async (ctx: Context & { session: BotSession, match?: any }) => {
  try {
    const transactionType = ctx.session.tempData?.transactionType;
    
    if (!transactionType || !ctx.session.tempData) {
      await ctx.answerCbQuery('Transaction data missing. Please try again.');
      return;
    }
    
    let response;
    
    if (transactionType === TRANSACTION_TYPES.EMAIL) {
      // Send to email
      response = await transferService.sendToEmail(
        ctx.session.tempData.recipient as string,
        ctx.session.tempData.amount as string,
        ctx.session.tempData.currencyId as string
      );
    } else if (transactionType === TRANSACTION_TYPES.WALLET) {
      // Send to wallet
      response = await transferService.sendToWallet(
        ctx.session.tempData.recipient as string,
        ctx.session.tempData.amount as string,
        ctx.session.tempData.currencyId as string,
        ctx.session.tempData.network as string
      );
    } else if (transactionType === TRANSACTION_TYPES.BANK) {
      // Withdraw to bank
      response = await transferService.withdrawToBank(
        ctx.session.tempData.amount as string,
        ctx.session.tempData.currencyId as string,
        ctx.session.tempData.recipient as string
      );
    }
    
    // Clear temporary data
    ctx.session.tempData = {};
    ctx.session.lastCommand = undefined;
    
    // Send success message
    await ctx.answerCbQuery('Transaction initiated successfully');
    await ctx.replyWithMarkdown(MESSAGES.SEND_SUCCESS, mainMenuKeyboard());
  } catch (error) {
    console.error('Error confirming transaction:', error);
    await ctx.answerCbQuery('Error processing transaction');
    await ctx.replyWithMarkdown(MESSAGES.TRANSACTION_ERROR);
  }
};

// Handle transaction cancellation
export const handleTransactionCancel = async (ctx: Context & { session: BotSession }) => {
  try {
    // Clear temporary data
    ctx.session.tempData = {};
    ctx.session.lastCommand = undefined;
    
    // Send cancellation message
    await ctx.answerCbQuery('Transaction cancelled');
    await ctx.replyWithMarkdown(MESSAGES.OPERATION_CANCELED, mainMenuKeyboard());
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    await ctx.answerCbQuery('Error cancelling transaction');
  }
}; 