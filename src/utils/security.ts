import crypto from 'crypto';

/**
 * Hassas verileri şifrelemek için kullanılan fonksiyon
 * @param data Şifrelenecek veri
 * @param secret Şifreleme anahtarı
 * @returns Şifrelenmiş veri
 */
export const encryptData = (data: string, secret: string): string => {
  // Initialization Vector (IV) - şifreleme için rastgele değer
  const iv = crypto.randomBytes(16);
  
  // Şifreleme algoritması oluşturma
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
  
  // Veriyi şifreleme
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // IV ve şifrelenmiş veriyi birleştirerek döndürme
  return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * Şifrelenmiş verilerin şifresini çözmek için kullanılan fonksiyon
 * @param encryptedData Şifrelenmiş veri
 * @param secret Şifreleme anahtarı
 * @returns Şifresi çözülmüş veri
 */
export const decryptData = (encryptedData: string, secret: string): string => {
  // Şifrelenmiş veriden IV'yi ayırma
  const [ivHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  
  // Şifre çözme algoritması oluşturma
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
  
  // Şifreyi çözme
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Güvenli bir şekilde rastgele şifreleme anahtarı oluşturan fonksiyon
 * @returns 32 byte (256 bit) şifreleme anahtarı
 */
export const generateSecretKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Kullanıcı şifrelerini hash'lemek için kullanılabilecek fonksiyon
 * @param password Şifre
 * @param salt Tuz (sağlanmazsa rastgele oluşturulur)
 * @returns {hash, salt} şeklinde hash ve tuz değerleri
 */
export const hashPassword = (password: string, providedSalt?: string): { hash: string, salt: string } => {
  const salt = providedSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

/**
 * Kripto cüzdan adreslerini doğrulamak için kullanılan fonksiyon
 * @param address Doğrulanacak cüzdan adresi
 * @param network Blockchain ağı (ethereum, tron, vb.)
 * @returns Adresin geçerli olup olmadığı
 */
export const isValidWalletAddress = (address: string, network: string = 'ethereum'): boolean => {
  // Ağ türüne göre regex seçimi
  const regexMap: Record<string, RegExp> = {
    ethereum: /^0x[a-fA-F0-9]{40}$/,
    tron: /^T[A-Za-z1-9]{33}$/,
    bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    // Diğer blockchain ağları için regex'ler eklenebilir
  };

  const regex = regexMap[network.toLowerCase()];
  if (!regex) return false;
  
  return regex.test(address);
};

/**
 * Email adreslerini doğrulamak için kullanılan fonksiyon
 * @param email Doğrulanacak email adresi
 * @returns Email adresinin geçerli olup olmadığı
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Transfer miktarını doğrulamak için kullanılan fonksiyon
 * @param amount Doğrulanacak miktar
 * @param minAmount Minimum miktar
 * @param maxAmount Maksimum miktar
 * @returns Miktarın geçerli olup olmadığı
 */
export const isValidAmount = (amount: string, minAmount: number = 0.1, maxAmount: number = 1000000): boolean => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount >= minAmount && numAmount <= maxAmount;
}; 