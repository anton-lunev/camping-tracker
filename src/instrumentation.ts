export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bot } = await import("@/server/bot/telegramBot");
    void bot.api.setWebhook("https://camping-tracker.vercel.app/api/telegram");
  }
}
