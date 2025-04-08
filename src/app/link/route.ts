import { bot } from "@/server/bot/telegramBot";
import type { NextRequest } from "next/server";
import { getUserDataByToken, removeToken } from "@/server/bot/token";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function sendSuccessMessage(chatId: number) {
  await bot.api.sendMessage(
    chatId,
    "🎉*Congrats\\! Your account is connected\\.*\nNow you can start tracking campsites 🏕",
    { parse_mode: "MarkdownV2" },
  );
  const linkMessage = await bot.api.sendMessage(
    chatId,
    "🏕 [https://camping-tracker.vercel.app/](https://camping-tracker.vercel.app/)",
    { parse_mode: "Markdown" },
  );
  await bot.api.pinChatMessage(chatId, linkMessage.message_id);
}

function sendErrorMessage(chatId: number) {
  return bot.api.sendMessage(
    chatId,
    "😱Failed to link your account, try again\\!",
    { parse_mode: "MarkdownV2" },
  );
}

async function matchAccounts(token: string) {
  const userData = await getUserDataByToken(token);
  console.log("userData", userData);
  if (!userData) return { success: false };

  const user = await currentUser();
  if (!user) {
    void sendErrorMessage(userData.id);
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
    await removeToken(token);
    void sendSuccessMessage(userData.id);
  } catch {
    void sendErrorMessage(userData.id);
    console.error("failed to update user metadata");
    return { success: false };
  }
  return { success: true };
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return Response.json("token not found");
  }
  await matchAccounts(token);

  redirect("/");
}
