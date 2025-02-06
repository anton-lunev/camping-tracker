import "dotenv/config";
import { router } from "@/server/utils/router";

const apiToken = process.env.TELEGRAM_API_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

if (!apiToken || !chatId) {
  throw new Error(
    "Environment variables TELEGRAM_API_TOKEN and TELEGRAM_CHAT_ID must be set.",
  );
}

const chatUrl = `https://api.telegram.org/bot${apiToken}/sendMessage`;

type CampInfo = {
  site: string;
  campsiteId?: string;
  date: string;
};

/**
 * Formats a link to a campsite. Supports Recreation.gov links.
 * @param site - The name of the campsite.
 * @param campsiteId - The ID of the campsite (optional).
 * @returns A formatted Markdown link or the site name if no ID is available.
 */
function formatSpotLink(site: string, campsiteId?: string): string {
  // TODO: support link to campsite for other sources.
  return campsiteId
    ? `[${site}](https://www.recreation.gov/camping/campsites/${campsiteId})`
    : site;
}

/**
 * Formats campsite information into a Telegram message.
 * @param campInfo - Array of campsite information objects.
 * @param url - The source URL for the campsite search.
 * @returns A formatted string ready to be sent to Telegram.
 */
export function formatInfoToMessage(campInfo: CampInfo[], url: string): string {
  const rows: string[] = [`Found ${campInfo.length} new camp sites in`, url];
  rows.push(
    ...campInfo.map(
      (el) =>
        `spot: ${formatSpotLink(el.site, el.campsiteId)}, date: ${el.date.split("T")[0]}`,
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
    console.error("Failed to post to Telegram channel:", error);
    throw error;
  }
}
