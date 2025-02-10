import {
  CampProvider,
  ProviderAdapterFactory,
} from "./providers/providerAdapterFactory";
import { RecreationAdapter } from "./providers/recreation/adapter";
import { ReserveCaliforniaAdapter } from "./providers/reserve-california/adapter";
import { Logger } from "@/server/utils/logger";
import type { TrackingStateItem } from "@/db/schema";
import { applyFilters } from "@/server/trackers/common/filters";
import { BaseError } from "@/server/trackers/common/errors";

// Register adapters
ProviderAdapterFactory.registerAdapter(
  CampProvider.RECREATION,
  new RecreationAdapter(),
);
ProviderAdapterFactory.registerAdapter(
  CampProvider.RESERVE_CALIFORNIA,
  new ReserveCaliforniaAdapter(),
);

export const logger = Logger.for("findCampsAndNotify");

export const findCampsAndNotify = async ({
  provider,
  campingId,
  days,
  weekDays,
  startDate,
  endDate,
  trackingState,
}: {
  provider: CampProvider;
  campingId: string;
  days: string[];
  weekDays: number[];
  startDate: string;
  endDate: string;
  trackingState?: TrackingStateItem;
}) => {
  const params = { campingId, days, weekDays, startDate, endDate };
  try {
    const adapter = ProviderAdapterFactory.getAdapter(provider);
    logger.debug("Searching for available spots", params);
    const results = await adapter.getCampsiteData({
      campingId,
      startDate,
      endDate,
    });

    const { allSpots, newSpots } = applyFilters(results, {
      days,
      weekDays,
      trackingState,
    });

    Logger.info(
      "[RecreationAdapter]",
      `available sites: ${allSpots.length}, new sites: ${newSpots.length}`,
    );

    if (newSpots.length) {
      const notificationData = adapter.getNotificationData(newSpots, campingId);
      if (notificationData) {
        try {
          // await postToChannel(formatInfoToMessage(notificationData));
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
