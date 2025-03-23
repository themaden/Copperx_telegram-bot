import { Context, Middleware } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import logger from '../utils/logger';

// Bot oturumu için tip tanımı
interface BotSession {
  lastActionTime?: number;
  requestCount?: number;
  commandCounts?: Record<string, { count: number, resetTime: number }>;
  isAdmin?: boolean;
  userId?: number;
}

// Session'lı Context tipi
interface SessionContext extends Context {
  session: BotSession;
}

// Rate limit seçenekleri
export interface RateLimitOptions {
  window: number;       // Pencere süresi (milisaniye)
  limit: number;        // İzin verilen maksimum istek sayısı
  onLimitExceeded?: (ctx: Context) => Promise<void>;  // Limit aşıldığında çalışacak fonksiyon
  enabled?: boolean;    // Rate limit etkin mi? (varsayılan: true)
  isAdmin?: (ctx: Context) => boolean;  // Kullanıcının admin olup olmadığını kontrol eden fonksiyon
}

// Kullanıcı başına oturum verilerini depolamak için kullanılır
interface RateLimitStorage {
  [userId: number]: {
    count: number;
    resetTime: number;
  };
}

// Memory bazlı storage (production ortamında Redis gibi harici storage kullanılmalı)
const storage: RateLimitStorage = {};

// Zamanı kontrol ederek temizlik işlemi yapma
const cleanupStorage = (): void => {
  const now = Date.now();
  
  Object.keys(storage).forEach(userId => {
    const numUserId = parseInt(userId, 10);
    if (storage[numUserId].resetTime < now) {
      delete storage[numUserId];
    }
  });
};

// Her 10 dakikada bir temizlik işlemi çalıştır
setInterval(cleanupStorage, 10 * 60 * 1000);

/**
 * Rate limit middleware'i - kullanıcı başına istek sayısını sınırlar
 * @param options Rate limit seçenekleri
 * @returns Telegraf Middleware
 */
export const rateLimit = (options: RateLimitOptions): Middleware<Context> => {
  // Varsayılan değerler
  const defaultOptions: RateLimitOptions = {
    window: 60 * 1000, // 1 dakika
    limit: 20,         // dakikada 20 istek
    enabled: true,
    onLimitExceeded: async (ctx) => {
      const remainingTime = Math.ceil((getUserResetTime(ctx) - Date.now()) / 1000);
      await ctx.reply(
        `⚠️ Çok fazla istek gönderdiniz. Lütfen ${remainingTime} saniye sonra tekrar deneyin.`
      );
    },
    isAdmin: (ctx) => {
      // Varsayılan olarak sadece config dosyasında tanımlanan adminler
      const adminIds = process.env.ADMIN_IDS ? 
        process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim(), 10)) : 
        [];
      return adminIds.includes(ctx.from?.id || 0);
    }
  };

  // Kullanıcının seçenekleri ile varsayılan seçenekleri birleştir
  const opts = { ...defaultOptions, ...options };

  // Kullanıcı için sıfırlama zamanını al
  const getUserResetTime = (ctx: Context): number => {
    const userId = ctx.from?.id || 0;
    return storage[userId]?.resetTime || 0;
  };

  return async (ctx, next) => {
    // Rate limit devre dışı bırakıldıysa, direkt geç
    if (!opts.enabled) {
      return next();
    }

    // Kullanıcı ID'sini al
    const userId = ctx.from?.id;
    if (!userId) {
      return next(); // Kullanıcı ID'si yoksa geç
    }

    // Admin kontrolü - adminler için rate limit uygulanmaz
    if (opts.isAdmin && opts.isAdmin(ctx)) {
      return next();
    }

    const now = Date.now();

    // Kullanıcı ilk kez istek yapıyorsa veya sıfırlama zamanı geçmişse
    if (!storage[userId] || storage[userId].resetTime <= now) {
      storage[userId] = {
        count: 1,
        resetTime: now + opts.window
      };
      return next();
    }

    // Kullanıcı limit dahilinde mi kontrol et
    if (storage[userId].count < opts.limit) {
      storage[userId].count += 1;
      return next();
    }

    // Limit aşıldı - özel mesaj gönder
    logger.warn(`Rate limit aşıldı: Kullanıcı ${userId} için`, {
      userId,
      count: storage[userId].count,
      limit: opts.limit,
      resetTime: new Date(storage[userId].resetTime).toISOString()
    });

    // Kullanıcıya bildir
    if (opts.onLimitExceeded) {
      await opts.onLimitExceeded(ctx);
    }

    return; // İşlemi durdur
  };
};

/**
 * Komut bazlı rate limit - her komut için ayrı limit uygular
 * @param command Komut adı
 * @param options Rate limit seçenekleri
 * @returns Telegraf Middleware
 */
export const commandSpecificRateLimit = (
  command: string,
  options: RateLimitOptions
): Middleware<Context> => {
  // Varsayılan değerler
  const defaultOptions: RateLimitOptions = {
    window: 30 * 1000, // 30 saniye
    limit: 5,          // 30 saniyede 5 istek
    enabled: true,
    onLimitExceeded: async (ctx) => {
      try {
        // Oturum session olarak erişim
        if ('session' in ctx && ctx.session && typeof ctx.session === 'object') {
          const session = ctx.session as Record<string, any>;
          
          if (session.commandCounts && 
              session.commandCounts[command] && 
              session.commandCounts[command].resetTime) {
            
            const resetTime = session.commandCounts[command].resetTime;
            const remainingTime = Math.ceil((resetTime - Date.now()) / 1000);
            
            await ctx.reply(
              `⚠️ /${command} komutunu çok sık kullanıyorsunuz. Lütfen ${remainingTime} saniye sonra tekrar deneyin.`
            );
            return;
          }
        }
        
        // Varsayılan mesaj (zaman olmadan)
        await ctx.reply(
          `⚠️ Bu komutu çok sık kullanıyorsunuz. Lütfen biraz bekleyin.`
        );
      } catch (error) {
        logger.error('Rate limit mesajı gönderilirken hata oluştu', { error });
      }
    }
  };

  // Kullanıcının seçenekleri ile varsayılan seçenekleri birleştir
  const opts = { ...defaultOptions, ...options };

  return async (ctx, next) => {
    // Rate limit devre dışı bırakıldıysa, direkt geç
    if (!opts.enabled) {
      return next();
    }

    // Oturum kontrolü - tipik olarak ctx.session kontrol edilir
    if (!('session' in ctx) || !ctx.session) {
      logger.error('Oturum bulunamadı: Komut rate limit için session middleware gerekli');
      return next();
    }

    // Oturum bilgisini al - type safety için
    const session = ctx.session as Record<string, any>;
    
    // Admin kontrolü
    if (opts.isAdmin && opts.isAdmin(ctx)) {
      return next();
    }

    // Komut sayıları nesnesini oluştur
    if (!session.commandCounts) {
      session.commandCounts = {};
    }

    const now = Date.now();

    // Komut ilk kez kullanılıyorsa veya sıfırlama zamanı geçmişse
    if (!session.commandCounts[command] || session.commandCounts[command].resetTime <= now) {
      session.commandCounts[command] = {
        count: 1,
        resetTime: now + opts.window
      };
      return next();
    }

    // Komut limit dahilinde mi kontrol et
    if (session.commandCounts[command].count < opts.limit) {
      session.commandCounts[command].count += 1;
      return next();
    }

    // Limit aşıldı
    logger.warn(`Komut rate limit aşıldı: ${command}`, {
      userId: ctx.from?.id,
      command,
      count: session.commandCounts[command].count,
      limit: opts.limit
    });

    // Kullanıcıya bildir
    if (opts.onLimitExceeded) {
      await opts.onLimitExceeded(ctx);
    }

    return; // İşlemi durdur
  };
}; 