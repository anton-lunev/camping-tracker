"use server";
import { findCampsAndNotify } from "./findCampsAndNotify";
import { getTrackerById } from "@/db/queries/trackers";
import { getProviderFromString } from "@/server/trackers/providers/providerAdapterFactory";
import { Logger } from "@/server/utils/logger";

export async function handleTracker(trackerId: string) {
  Logger.debug("[handleTracker]", `Tracker ${trackerId} logic running...`);
  const sub = await getTrackerById(trackerId);
  if (!sub) {
    return;
  }

  sub.campings.forEach(
    (camping: { id: string; name: string; provider: string }) => {
      const provider = getProviderFromString(camping.provider);
      findCampsAndNotify(
        provider,
        camping.id,
        sub.days,
        sub.weekDays,
        sub.startDate,
        sub.endDate,
      );
    },
  );
}
