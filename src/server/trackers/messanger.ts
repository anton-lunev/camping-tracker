import "dotenv/config";
import { router } from "@/server/utils/router";
import { Logger } from "@/server/utils/logger";
import {
  CampsiteData,
  NotificationData,
} from "@/server/trackers/providers/providerAdapter";

const apiToken = process.env.TELEGRAM_API_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

if (!apiToken || !chatId) {
  throw new Error(
    "Environment variables TELEGRAM_API_TOKEN and TELEGRAM_CHAT_ID must be set.",
  );
}

const chatUrl = `https://api.telegram.org/bot${apiToken}/sendMessage`;

/**
 * Formats a link to a campsite. Supports Recreation.gov links.
 * @returns A formatted Markdown link or the site name if no ID is available.
 */
function formatCampsiteLink(
  campsiteData: CampsiteData,
  campsiteUrl?: string,
): string {
  const campsiteName = campsiteData.siteName ?? campsiteData.siteId;

  if (!campsiteUrl) return campsiteName;
  return `[${campsiteName}](${router.resolve(campsiteUrl, campsiteData)})`;
}

/**
 * Formats campsite information into a Telegram message.
 * @returns A formatted string ready to be sent to Telegram.
 */
export function formatInfoToMessage(
  notificationData: NotificationData,
): string {
  const rows: string[] = [
    `Found ${notificationData.count} new camp sites in`,
    `[${notificationData.campingName}](${notificationData.campingUrl})`,
  ];
  // TODO: merge date intervals for the same spots
  rows.push(
    ...notificationData.results.map(
      (el) =>
        `spot: ${formatCampsiteLink(el, notificationData.campsiteUrl)}, date: ${el.date}`,
    ),
  );
  return rows.join("\n");
}

/**
 * Sends a message to the Telegram channel.
 * @param text - The message text to send.
 * @returns A promise that resolves when the fetch call completes.
 */
export async function postToChannel(text: string) {
  const url = router.resolve(chatUrl, {}, { chat_id: chatId, text });
  try {
    return await fetch(url, { method: "GET" });
  } catch (error) {
    Logger.error("Messenger", "Failed to post to Telegram channel:", error);
    throw error;
  }
}
