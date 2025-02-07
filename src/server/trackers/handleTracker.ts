"use server";
import { findCampsAndNotify } from "./findCampsAndNotify";
import { getTrackerById, updateTrackerDb } from "@/db/queries/trackers";
import { getProviderFromString } from "@/server/trackers/providers/providerAdapterFactory";
import { Logger } from "@/server/utils/logger";
import { getTrackingStateItem } from "@/server/trackers/utils";

export async function handleTracker(trackerId: string) {
  Logger.debug("[handleTracker]", `Tracker ${trackerId} logic running...`);
  const tracker = await getTrackerById(trackerId);
  if (!tracker) {
    return;
  }

  tracker.campings.forEach(
    (camping: { id: string; name: string; provider: string }) => {
      const provider = getProviderFromString(camping.provider);
      findCampsAndNotify(
        provider,
        camping.id,
        tracker.days,
        tracker.weekDays,
        tracker.startDate,
        tracker.endDate,
        tracker.trackingState[camping.id],
      ).then((results) => {
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
