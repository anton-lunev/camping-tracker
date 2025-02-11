import "dotenv/config";
import { Bot, GrammyError, HttpError } from "grammy";
import { Logger } from "@/server/utils/logger";
import { createTokenForUser } from "@/server/bot/token";

const logger = Logger.for("Telegram bot");

export const bot = new Bot(process.env.TELEGRAM_API_TOKEN!);

bot.api.setMyCommands([{ command: "link", description: "Link account" }]);

bot.command(["link", "start"], async (ctx) => {
  console.log(JSON.stringify(ctx, null, 2));
  const userData = ctx.update.message?.from;
  if (userData?.is_bot) {
    return await ctx.reply("Bots can't go camping 🤖🏕");
  }
  const { id, username } = userData ?? {};
  if (!id || !username) {
    return await ctx.reply("Cannot retrieve your user data");
  }
  const token = createTokenForUser({ id, username });
  await ctx.reply(
    `Welcome!\nFollow the link to connect your account: \nhttps://camping-tracker.vercel.app/link/${token}`,
  );
});

bot.catch((botError) => {
  const ctx = botError.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = botError.error;

  if (e instanceof GrammyError) {
    logger.error(`Error in request`, e.description);
  } else if (e instanceof HttpError) {
    logger.error(`Could not connect to Telegram`, e);
  } else {
    logger.error(`Unknown error`, e);
  }
});

bot.start();
console.log("Starting telegram bot...");
