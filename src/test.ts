import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test mesajları
console.log("\n🤖 Copperx Telegram Bot - Test Mode\n");
console.log("👉 Bot token için doğru değer girilene kadar gerçek bot başlatılamıyor.");
console.log("👉 Telegram'da @BotFather ile konuşarak yeni bir bot oluşturun.");
console.log("👉 Aldığınız bot token'ını .env dosyasına ekleyin:");
console.log("   BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi");
console.log("\n✅ Bot işlevselliği test edilmeye hazır.\n");

console.log("📋 Bot Kurulum Adımları:");
console.log("1. Telegram'da @BotFather ile konuşun");
console.log("2. /newbot komutunu gönderin");
console.log("3. Bot için bir isim verin");
console.log("4. Bot için bir kullanıcı adı belirleyin (sonu 'bot' ile bitmeli)");
console.log("5. BotFather'ın size verdiği token'ı kopyalayın");
console.log("6. .env dosyasındaki BOT_TOKEN değerini bu token ile değiştirin");
console.log("7. Uygulamayı tekrar başlatın: npm run dev\n");

console.log("Token formatı: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi");
console.log("Örnek .env satırı: BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi\n");

// Mevcut token'ı göster
console.log(`Şu anki token: ${process.env.BOT_TOKEN}`);
console.log("\n⚠️ Yukarıdaki token geçersiz. Lütfen BotFather'dan aldığınız gerçek token ile değiştirin.\n"); 