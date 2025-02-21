"use server";

import {
  addTrackerDb,
  getUserTrackers,
  type NewTracker,
  removeTrackerDb,
  updateTrackerDb,
} from "@/db/queries/trackers";
import { getProviderFromString } from "@/server/trackers/providers/providerAdapterFactory";
import { currentUser } from "@clerk/nextjs/server";
import type { Camping, Tracker } from "@/db/schema";
import { handleTracker } from "@/server/trackers/handleTracker";
import { getProviderAdapter } from "@/server/trackers/providers";
import { parseCampingUrl } from "./utils";

export async function getCampingDataByUrl(
  campingUrl: string,
): Promise<Camping | null> {
  const { provider, parkId, campingId } = parseCampingUrl(campingUrl);
  const id = parkId ? `${parkId}:${campingId}` : campingId;

  try {
    const data = await getCampingInfo(provider, id);

    return {
      ...data,
      provider,
      id,
    };
  } catch {
    return null;
  }
}

export async function getCampingInfo(provider: string, id: string) {
  const adapter = getProviderAdapter(getProviderFromString(provider));
  return adapter.getCampingInfo(id);
}

export async function getTrackers() {
  const user = await currentUser();
  if (user?.id) {
    return await getUserTrackers(user.id);
  }
  return [];
}

export async function refreshTracker(tracker: Tracker) {
  const user = await currentUser();
  if (user?.id) {
    if (tracker.active) {
      await handleTracker(tracker);
    }
  }
}

export async function updateTracker(data: Tracker) {
  const user = await currentUser();
  if (user?.id) {
    data.trackingState = {};
    const [updatedTracker] = await updateTrackerDb(data);
    if (updatedTracker.active) {
      await handleTracker(updatedTracker);
    }
  }
}

export async function createTracker(newTracker: Omit<NewTracker, "owner">) {
  const user = await currentUser();
  if (user?.id) {
    const data = await addTrackerDb({ ...newTracker, owner: user.id });
    const [tracker] = data;
    if (tracker.active) {
      await handleTracker(tracker);
    }
  }
}

export async function removeTracker(trackerId: string) {
  const user = await currentUser();
  if (user?.id) {
    await removeTrackerDb(trackerId);
  }
}
