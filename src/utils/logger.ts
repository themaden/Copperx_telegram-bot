import winston from 'winston';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Varsayılan loglama seviyesi
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Logs klasörünü oluştur
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Hassas veri maskesi için regex
const PATTERNS: Record<string, RegExp> = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  WALLET: /(?<![a-zA-Z0-9])[13][a-km-zA-HJ-NP-Z1-9]{25,34}(?![a-zA-Z0-9])/g,  // Bitcoin cüzdan adresi
  ETHEREUM: /0x[a-fA-F0-9]{40}/g, // Ethereum cüzdan adresi
  CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/g,
  PHONE: /(?:\+|00)[0-9]{1,3}[ -]?(?:\([0-9]{1,3}\)|[0-9]{1,3})[ -]?[0-9]{1,4}[ -]?[0-9]{1,4}[ -]?[0-9]{1,9}/g,
  SSN: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g, // Sosyal güvenlik numarası
  IP: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  BEARER_TOKEN: /Bearer\s+[a-zA-Z0-9\-._~+\/]+=*/g,
  JWT: /eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g,
};

// Hassas veriyi maskele
const maskSensitiveData = (input: any): any => {
  // Null veya primitive olmayan nesneler için dönüş
  if (input === null || input === undefined) return input;
  
  // Fonksiyonları olduğu gibi döndür
  if (typeof input === 'function') return input;
  
  // String ise maskele
  if (typeof input === 'string') {
    let masked = input;
    
    // Tüm patternler için kontrol et
    Object.entries(PATTERNS).forEach(([key, pattern]) => {
      masked = masked.replace(pattern, (match: string) => {
        // İlk ve son 3 karakteri göster, geri kalanı maskele
        if (match.length <= 6) {
          return '*'.repeat(match.length);
        }
        const firstThree = match.substring(0, 3);
        const lastThree = match.substring(match.length - 3);
        return `${firstThree}${'*'.repeat(match.length - 6)}${lastThree}`;
      });
    });
    
    return masked;
  }
  
  // Sayılar ve boolean değerler için hiçbir şey yapma
  if (typeof input !== 'object') return input;
  
  // Array kontrolü
  if (Array.isArray(input)) {
    return input.map(item => maskSensitiveData(item));
  }
  
  // Obje ise her property'yi maskele
  const maskedObj: Record<string, any> = {};
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      // Hassas alan adları kontrolü
      if (['password', 'secret', 'token', 'apiKey', 'key', 'privateKey', 'seedPhrase', 'mnemonic'].includes(key.toLowerCase())) {
        maskedObj[key] = '********';
      } else {
        maskedObj[key] = maskSensitiveData(input[key]);
      }
    }
  }
  
  return maskedObj;
};

// Özel formatlayıcı - meta verilerini json olarak biçimlendirir
const formatter = winston.format((info: winston.Logform.TransformableInfo) => {
  // Hata objelerini düzgün biçimlendirme
  if (info.error instanceof Error) {
    const { message, stack, ...rest } = info.error;
    info.error = {
      message,
      stack,
      ...rest
    };
  }
  
  // Hassas verileri maskele
  return maskSensitiveData(info);
});

// Loglama formatı
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  formatter(),
  winston.format.json()
);

// Console transport formatı
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...rest }: winston.Logform.TransformableInfo) => {
    const meta = Object.keys(rest).length ? util.inspect(rest, { depth: 3, colors: true }) : '';
    return `${timestamp} [${level}]: ${message} ${meta}`;
  })
);

// Logger oluştur
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'copperx-telegram-bot' },
  transports: [
    // Console çıktısı
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // Günlük dosya çıktısı 
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Tüm log seviyesindeki çıktılar
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

// Üretim dışı ortamlarda daha renkli konsol çıktısı
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Basit bir kullanım örneği:
// logger.info('Bu bir bilgi mesajıdır');
// logger.error('Hata oluştu', { error: new Error('Hata açıklaması'), userId: 123 });
// logger.warn('Bu bir uyarı mesajıdır', { someData: 'veri', email: 'user@example.com' });

export default logger; 