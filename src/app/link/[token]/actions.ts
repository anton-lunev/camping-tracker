"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { getUserDataByToken } from "@/server/bot/token";
import { bot } from "@/server/bot/telegramBot";

function sendSuccessMessage(chatId: number) {
  return bot.api.sendMessage(
    chatId,
    "🎉*Congrats\\! Your account is connected\\.*\nNow you can start tracking campsites 🏕",
    { parse_mode: "MarkdownV2" },
  );
}

function sendErrorMessage(chatId: number) {
  return bot.api.sendMessage(
    chatId,
    "😱Failed to link your account, try again\\!",
    { parse_mode: "MarkdownV2" },
  );
}

export async function matchAccounts(token: string) {
  const userData = getUserDataByToken(token);
  console.log("userData", userData);
  if (!userData) return { success: false };

  const user = await currentUser();
  if (!user) {
    sendErrorMessage(userData.id);
    return { success: false };
  }

  const client = await clerkClient();
  try {
    await client.users.updateUser(user?.id, {
      privateMetadata: {
        telegramId: userData.id,
        telegramUsername: userData.username,
      },
    });
    sendSuccessMessage(userData.id);
  } catch {
    sendErrorMessage(userData.id);
    console.error("failed to update user metadata");
    return { success: false };
  }
  return { success: true };
}
