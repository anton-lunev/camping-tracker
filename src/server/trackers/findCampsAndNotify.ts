import {
  CampProvider,
  ProviderAdapterFactory,
} from "./providers/providerAdapterFactory";
import { RecreationAdapter } from "./providers/recreation/adapter";
import { ReserveCaliforniaAdapter } from "./providers/reserve-california/adapter";
import {
  formatInfoToMessage,
  postToChannel,
} from "@/server/trackers/messanger";
import { Logger } from "@/server/utils/logger";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter"; // Register adapters

// Register adapters
ProviderAdapterFactory.registerAdapter(
  CampProvider.RECREATION,
  new RecreationAdapter(),
);
ProviderAdapterFactory.registerAdapter(
  CampProvider.RESERVE_CALIFORNIA,
  new ReserveCaliforniaAdapter(),
);

// TODO: Move this to a database
const handledCampSites: CampsiteData[] = [];

const logger = Logger.for("findCampsAndNotify");

// Main function to find camps
export const findCampsAndNotify = async (
  provider: CampProvider,
  campId: string,
  days: string[],
  weekDays: number[],
  start: string,
  end: string,
) => {
  try {
    const adapter = ProviderAdapterFactory.getAdapter(provider);
    const results = await adapter.findCamp(
      campId,
      days,
      weekDays,
      start,
      end,
      handledCampSites,
    );

    if (results.length) {
      handledCampSites.push(...results);

      const notificationData = adapter.getNotificationData(results, campId);
      if (notificationData) {
        try {
          await postToChannel(formatInfoToMessage(notificationData));
        } catch (error) {
          logger.error("Failed to post notification", error);
          throw error;
        }
      }
    }

    return results;
  } catch (error) {
    logger.error("Error finding campsites:", error);
  }
};
