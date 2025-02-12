"use server";
import { findCampsAndNotify } from "./findCampsAndNotify";
import { updateTrackerDb } from "@/db/queries/trackers";
import { getProviderFromString } from "@/server/trackers/providers/providerAdapterFactory";
import { Logger } from "@/server/utils/logger";
import { getTrackingStateItem } from "@/server/trackers/utils";
import { clerkClient } from "@clerk/nextjs/server";
import type { Tracker } from "@/db/schema";

export async function handleTracker(tracker: Tracker) {
  Logger.debug("handleTracker", `Tracker ${tracker.id} logic running...`);
  
  const client = await clerkClient();
  const user = await client.users.getUser(tracker.owner);
  if (!user) {
    Logger.error("handleTracker", `user ${tracker.owner} not found`);
    return;
  }
  const chatId = user.privateMetadata.telegramId as number | undefined;
  if (chatId === undefined) {
    Logger.error(
      "handleTracker",
      `user ${user.id} is not connected to telegram`,
    );
    return;
  }

  tracker.campings.forEach(
    (camping: { id: string; name: string; provider: string }) => {
      const provider = getProviderFromString(camping.provider);

      findCampsAndNotify({
        provider,
        campingId: camping.id,
        ...tracker,
        trackingState: tracker.trackingState[camping.id],
        chatId,
      }).then((results) => {
        // Update tracking state of the current camping id
        const updatedTracker = {
          ...tracker,
          trackingState: {
            ...tracker.trackingState,
            [camping.id]: getTrackingStateItem(camping.id, results),
          },
        };
        updateTrackerDb(updatedTracker);
      });
    },
  );
}
