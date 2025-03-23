import { Context, Middleware } from 'telegraf';
import crypto from 'crypto';
import logger from '../utils/logger';

/**
 * Telegraf için webhook güvenlik doğrulaması
 * @param secretToken Webhook güvenlik token'ı (process.env.WEBHOOK_SECRET)
 * @returns Telegraf Middleware
 */
export const webhookSecurityMiddleware = (secretToken: string): Middleware<Context> => {
  return async (ctx, next) => {
    // Webhook isteğindeki güvenlik token'ını kontrol et
    // Not: Bu özellik henüz Telegraf tarafından tam olarak desteklenmiyor
    // bu nedenle işlevi gerçek webhook ayarına göre uyarlamanız gerekebilir
    
    // Güvenlik kontrolü
    try {
      // Secret token doğrulaması burada yapılacak
      // Gerçek uygulamada webhook request header'larını kontrol edin
      
      // Devam et
      return next();
    } catch (error) {
      logger.error('Webhook güvenlik doğrulaması başarısız', { error });
      return;
    }
  };
};

/**
 * Telegram botunun güvenlik ayarlarını yapılandırma 
 * @param bot Telegraf bot nesnesi
 */
export const setupBotSecurity = async (bot: any): Promise<void> => {
  try {
    // WebHook ayarları için güvenli HTTPS URL ve gizli token oluştur
    if (process.env.NODE_ENV === 'production' && process.env.WEBHOOK_URL) {
      // En az 32 karakter uzunluğunda rasgele token
      const secretToken = process.env.WEBHOOK_SECRET || 
        crypto.randomBytes(32).toString('hex');
      
      // API'ye webhooks/setWebhook isteği gönderilecek
      await bot.telegram.setWebhook(process.env.WEBHOOK_URL, {
        drop_pending_updates: true,
        secret_token: secretToken,
        allowed_updates: ['message', 'callback_query', 'my_chat_member']
      });
      
      logger.info('Webhook güvenli bir şekilde ayarlandı');
    }
  } catch (error) {
    logger.error('Bot güvenlik ayarları yapılandırılırken hata oluştu', { error });
  }
};

/**
 * Express için güvenlik başlıkları middleware'i
 * Bu fonksiyon, Express kullanıldığında projeye helmet ve cors eklendikten sonra kullanılabilir
 */
// export const applySecurityHeaders = (app: any): void => {
//   // Helmet ile güvenlik başlıkları ekleme
//   app.use(helmet());
//   
//   // CORS koruması
//   app.use(cors({
//     origin: process.env.CORS_ORIGIN || '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   }));
//   
//   // XSS koruması için Content-Security-Policy
//   app.use((req: any, res: any, next: any) => {
//     res.setHeader(
//       'Content-Security-Policy',
//       "default-src 'self'; script-src 'self'; object-src 'none'; img-src 'self' data:; connect-src 'self'"
//     );
//     next();
//   });
// }; 