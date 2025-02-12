export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bot } = await import("@/server/bot/telegramBot");
    bot.start();
    console.log("Starting telegram bot...");
    const { startTrackers } = await import("@/server/scheduler/trackers");
    await startTrackers();
  }
}
