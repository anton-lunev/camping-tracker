const TELEGRAM_WEBHOOK_URL = "https://camping-tracker.vercel.app/api/telegram";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bot } = await import("@/server/bot/telegramBot");
    const webhookInfo = await bot.api.getWebhookInfo();
    console.log("webhookInfo", webhookInfo);
    if (webhookInfo.url !== TELEGRAM_WEBHOOK_URL) {
      void bot.api.setWebhook(TELEGRAM_WEBHOOK_URL);
    }
  }
}
