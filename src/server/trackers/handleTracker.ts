"use server";
import { findCampsAndNotify } from "./findCampsAndNotify";
import { updateTrackerDb } from "@/db/queries/trackers";
import { getProviderFromString } from "@/server/trackers/providers/providerAdapterFactory";
import { Logger } from "@/server/utils/logger";
import { getTrackingStateItem } from "@/server/trackers/utils";
import { clerkClient } from "@clerk/nextjs/server";
import type { Tracker } from "@/db/schema";

export async function handleTracker(tracker: Tracker) {
  Logger.info("handleTracker", `Tracker ${tracker.id} logic running...`);

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

  const results = await Promise.all(
    tracker.campings.map(
      async (camping: { id: string; name: string; provider: string }) => {
        const provider = getProviderFromString(camping.provider);

        const spots = await findCampsAndNotify({
          provider,
          campingId: camping.id,
          ...tracker,
          trackingState: tracker.trackingState[camping.id],
          chatId,
        });
        return { campingId: camping.id, spots };
      },
    ),
  );

  // Build updated tracking state: only overwrite entries for successful API calls
  const updatedTrackingState = { ...tracker.trackingState };
  let hasUpdates = false;
  for (const { campingId, spots } of results) {
    if (spots) {
      updatedTrackingState[campingId] = getTrackingStateItem(campingId, spots);
      hasUpdates = true;
    }
  }

  if (hasUpdates) {
    await updateTrackerDb({
      ...tracker,
      trackingState: updatedTrackingState,
    });
  }
}
