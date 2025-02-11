"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { getUserDataByToken } from "@/server/bot/token";

export async function matchAccounts(token: string) {
  const userData = getUserDataByToken(token);
  console.log("userData", userData);
  if (!userData) return { success: false };

  const user = await currentUser();
  if (!user) return { success: false };

  const client = await clerkClient();
  try {
    await client.users.updateUser(user?.id, {
      privateMetadata: {
        telegramId: userData.id,
        telegramUsername: userData.username,
      },
    });
  } catch {
    console.error("failed to update user metadata");
    return { success: false };
  }
  return { success: true };
}
