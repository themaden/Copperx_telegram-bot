import { Markup } from 'telegraf';
import { Wallet, Balance } from '../types';

// Main menu keyboard
export const mainMenuKeyboard = () => {
  return Markup.keyboard([
    ['💼 Wallets', '💰 Balance', '💸 Send'],
    ['📝 History', '👤 Profile', '❓ Help']
  ]).resize();
};

// Back to main menu keyboard
export const backToMainKeyboard = () => {
  return Markup.keyboard([
    ['🔙 Back to Main Menu']
  ]).resize();
};

// Login keyboard
export const loginKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🔑 Login', 'login')]
  ]);
};

// Cancel keyboard
export const cancelKeyboard = () => {
  return Markup.keyboard([
    ['❌ Cancel']
  ]).oneTime().resize();
};

// Wallet list keyboard
export const walletsKeyboard = (wallets: Wallet[]) => {
  const buttons = wallets.map(wallet => {
    const isDefaultText = wallet.isDefault ? ' (Default)' : '';
    return [`${wallet.name} - ${wallet.network}${isDefaultText}`];
  });
  
  buttons.push(['🔙 Back to Main Menu']);
  
  return Markup.keyboard(buttons).resize();
};

// Set default wallet keyboard
export const setDefaultWalletKeyboard = (wallets: Wallet[]) => {
  const buttons = wallets.map(wallet => {
    return [Markup.button.callback(
      `${wallet.name} - ${wallet.network}`, 
      `setdefault:${wallet.id}`
    )];
  });
  
  buttons.push([Markup.button.callback('🔙 Back', 'back_to_wallets')]);
  
  return Markup.inlineKeyboard(buttons);
};

// Send options keyboard
export const sendOptionsKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📧 Send to Email', 'send_email')],
    [Markup.button.callback('👛 Send to Wallet', 'send_wallet')],
    [Markup.button.callback('🏦 Withdraw to Bank', 'withdraw_bank')],
    [Markup.button.callback('🔙 Back', 'back_to_main')]
  ]);
};

// Confirm transaction keyboard
export const confirmTransactionKeyboard = (transactionType: string) => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Confirm', `confirm_${transactionType}`),
      Markup.button.callback('❌ Cancel', 'cancel_transaction')
    ]
  ]);
};

// Balance keyboard with wallets
export const balanceKeyboard = (balances: Balance[]) => {
  const buttons = balances.map(balance => {
    return [`${balance.walletName} - ${balance.currencyCode}`];
  });
  
  buttons.push(['🔙 Back to Main Menu']);
  
  return Markup.keyboard(buttons).resize();
};

// Help keyboard
export const helpKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.url('📚 Documentation', 'https://income-api.copperx.io/api/doc')],
    [Markup.button.url('💬 Support', 'https://t.me/copperxcommunity/2183')],
    [Markup.button.callback('🔙 Back', 'back_to_main')]
  ]);
}; 