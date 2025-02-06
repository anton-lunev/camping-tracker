import {
  CampAdapterFactory,
  CampProvider,
} from "./providers/campAdapterFactory";
import { RecreationAdapter } from "./providers/recreation/adapter";
import { ReserveCaliforniaAdapter } from "./providers/reserve-california/adapter";
import { CampsiteData } from "./types";
import {
  formatInfoToMessage,
  postToChannel,
} from "@/server/trackers/messanger";
import { Logger } from "@/server/utils/logger"; // Register adapters

// Register adapters
CampAdapterFactory.registerAdapter(
  CampProvider.RECREATION,
  new RecreationAdapter(),
);
CampAdapterFactory.registerAdapter(
  CampProvider.RESERVE_CALIFORNIA,
  new ReserveCaliforniaAdapter(),
);

// TODO: Move this to a database
const handledCampSites: CampsiteData[] = [];

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
    const adapter = CampAdapterFactory.getAdapter(provider);
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
          await postToChannel(
            formatInfoToMessage(notificationData.results, notificationData.url),
          );
        } catch (error) {
          Logger.error("findCamp", "Failed to post notification", error);
          throw error;
        }
      }
    }

    return results;
  } catch (error) {
    Logger.error("findCamp", "Error finding campsites:", error);
  }
};
