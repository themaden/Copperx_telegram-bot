import { isValidEmail, isValidWalletAddress, isValidAmount } from './security';

// Re-export ettiğimiz temel validasyon fonksiyonları
export { isValidEmail, isValidWalletAddress, isValidAmount };

/**
 * Kullanıcı girişlerini XSS saldırılarına karşı temizleyen fonksiyon
 * @param input Temizlenecek metin
 * @returns Temizlenmiş metin
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * OTP (One-Time Password) doğrulama kodu validasyonu
 * @param otp Doğrulama kodu
 * @param length Beklenen OTP uzunluğu (varsayılan: 6)
 * @returns OTP'nin geçerli olup olmadığı
 */
export const isValidOtp = (otp: string, length: number = 6): boolean => {
  const otpRegex = new RegExp(`^\\d{${length}}$`);
  return otpRegex.test(otp);
};

/**
 * Banka hesap numarası validasyonu
 * @param accountId Banka hesap ID/numarası
 * @returns Hesap numarasının geçerli olup olmadığı
 */
export const isValidBankAccount = (accountId: string): boolean => {
  // Basit bir validasyon: Sadece sayılardan oluşan ve en az 5 karakter
  // Gerçek bir uygulamada daha kapsamlı validasyon gerekir
  return /^\d{5,}$/.test(accountId);
};

/**
 * İşlem açıklaması validasyonu
 * @param description İşlem açıklaması
 * @param maxLength Maksimum uzunluk (varsayılan: 100)
 * @returns Açıklamanın geçerli olup olmadığı
 */
export const isValidDescription = (description: string, maxLength: number = 100): boolean => {
  if (!description) return true; // Açıklama opsiyonel olabilir
  return description.length <= maxLength;
};

/**
 * Para birimi kodu validasyonu
 * @param currency Para birimi kodu (örn: USD, EUR)
 * @returns Para birimi kodunun geçerli olup olmadığı
 */
export const isValidCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'USDC', 'USDT', 'DAI'];
  return validCurrencies.includes(currency.toUpperCase());
};

/**
 * Kripto para ağı validasyonu
 * @param network Ağ adı (örn: ethereum, tron)
 * @returns Ağ adının geçerli olup olmadığı
 */
export const isValidNetwork = (network: string): boolean => {
  const validNetworks = ['ethereum', 'tron', 'polygon', 'bsc', 'avalanche', 'solana'];
  return validNetworks.includes(network.toLowerCase());
};

/**
 * Kullanıcı adı validasyonu
 * @param username Kullanıcı adı
 * @returns Kullanıcı adının geçerli olup olmadığı
 */
export const isValidUsername = (username: string): boolean => {
  // Sadece harf, rakam, alt çizgi ve nokta içerebilir
  // 3-30 karakter uzunluğunda olmalı
  return /^[a-zA-Z0-9_.]{3,30}$/.test(username);
};

/**
 * Tarih formatı validasyonu (YYYY-MM-DD)
 * @param dateString Tarih metni
 * @returns Tarih formatının geçerli olup olmadığı
 */
export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date.toString() !== 'Invalid Date';
};

/**
 * Telefon numarası validasyonu
 * @param phone Telefon numarası
 * @returns Telefon numarasının geçerli olup olmadığı
 */
export const isValidPhone = (phone: string): boolean => {
  // Sadece sayılar, +, - ve boşluk içerebilir
  // En az 7 karakter uzunluğunda olmalı
  return /^[0-9+\-\s]{7,}$/.test(phone);
}; 