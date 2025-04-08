import type { CampProvider } from "./providers/providerAdapterFactory";
import { Logger } from "@/server/utils/logger";
import type { TrackingStateItem } from "@/db/schema";
import { applyFilters } from "@/server/trackers/common/filters";
import { BaseError } from "@/server/trackers/common/errors";
import {
  formatInfoToMessage,
  postToChannel,
} from "@/server/trackers/messanger";
import { getProviderAdapter } from "./providers";

export const logger = Logger.for("findCampsAndNotify");

export const findCampsAndNotify = async ({
  provider,
  campingId,
  days,
  weekDays,
  startDate,
  endDate,
  trackingState,
  chatId,
}: {
  provider: CampProvider;
  campingId: string;
  days: string[];
  weekDays: number[];
  startDate: string;
  endDate: string;
  trackingState?: TrackingStateItem;
  chatId: number;
}) => {
  const params = { campingId, days, weekDays, startDate, endDate, provider };
  try {
    const adapter = getProviderAdapter(provider);
    logger.info(`Searching for available spots`, params);
    const results = await adapter.getCampsiteData({
      campingId,
      startDate,
      endDate,
    });

    const { allSpots, newSpots } = applyFilters(results, {
      dateRange: [startDate, endDate],
      days,
      weekDays,
      trackingState,
    });

    logger.info(
      `available sites: ${allSpots.length}, new sites: ${newSpots.length}`,
      params,
    );

    if (newSpots.length) {
      const notificationData = adapter.getNotificationData(newSpots, campingId);
      if (notificationData) {
        try {
          await postToChannel(formatInfoToMessage(notificationData), chatId);
        } catch (error) {
          logger.error("Failed to post notification", error);
        }
      }
    }

    return allSpots;
  } catch (error) {
    if (error instanceof BaseError) {
      logger.error("Provider error occurred", {
        error: error.message,
        context: error.context,
        params,
      });
    }

    logger.error("Unexpected error occurred", {
      error: error instanceof Error ? error.message : String(error),
      params,
    });
  }
};
