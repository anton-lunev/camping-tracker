import "dotenv/config";
import { router } from "@/server/utils/router";
import { Logger } from "@/server/utils/logger";
import type {
  CampsiteData,
  NotificationData,
} from "@/server/trackers/providers/providerAdapter";
import { groupBy } from "lodash";
import { formatDate, toDate } from "@/lib/date";
import { bot } from "@/server/bot/telegramBot";

// Helper function to escape MarkdownV2 reserved characters
function escapeMarkdownV2(text: string): string {
  const reservedChars = "_*[]()~`>#+-=|{}.!";
  return text
    .split("")
    .map((char) => (reservedChars.includes(char) ? `\\${char}` : char))
    .join("");
}

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

const maxMessageLength = 4000; // Telegram's message limit

function getLimitedRows(rows: string[]) {
  let symbols = 0;
  const limitedRows = [];
  for (const row of rows) {
    symbols += row.length;
    if (symbols > maxMessageLength) {
      limitedRows.push(
        escapeMarkdownV2(`+${rows.length - limitedRows.length} more...`),
      );
      return limitedRows;
    }
    limitedRows.push(row);
  }
  return limitedRows;
}

/**
 * Formats campsite information into a Telegram message.
 * @returns A formatted string ready to be sent to Telegram.
 */
export function formatInfoToMessage(
  notificationData: NotificationData,
): string {
  const rows: string[] = [
    `*Found ${notificationData.count} free camp sites in* `,
    `[${escapeMarkdownV2(notificationData.campingName)}](${notificationData.campingUrl})\n`,
  ];
  const groupedSites = Object.entries(
    groupBy(notificationData.results, "siteName"),
  ).toSorted(([a], [b]) => a.localeCompare(b));
  rows.push(
    ...groupedSites.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, sites]) =>
        `• *${formatCampsiteLink(sites[0]!, notificationData.campsiteUrl)}:* ${escapeMarkdownV2(
          sites
            .map((site) => formatDate(toDate(site.date), "MMM-dd"))
            .join(", "),
        )}`,
    ),
  );

  return getLimitedRows(rows).join("\n");
}

/** Sends a message to the Telegram channel. */
export async function postToChannel(text: string, chatId: number) {
  try {
    await bot.api.sendMessage(chatId, text, { parse_mode: "MarkdownV2" });
  } catch (error) {
    Logger.error("Messenger", "Failed to post to Telegram channel:", error);
    throw error;
  }
}
