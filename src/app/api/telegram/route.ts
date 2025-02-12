import { webhookCallback } from "grammy";
import { bot } from "@/server/bot/telegramBot";
import type { NextRequest } from "next/server";

// webhookCallback will make sure that the correct middleware(listener) function is called
export const POST = (req: NextRequest) => {
  console.log("Telegram webhook");
  return webhookCallback(bot, "std/http")(req);
};
