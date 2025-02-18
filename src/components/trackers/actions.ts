"use server";

import {
  addTrackerDb,
  getUserTrackers,
  type NewTracker,
  removeTrackerDb,
  updateTrackerDb,
} from "@/db/queries/trackers";
import { z } from "zod";
import { CampProvider } from "@/server/trackers/providers/providerAdapterFactory";
import { currentUser } from "@clerk/nextjs/server";
import type { Tracker } from "@/db/schema";
import { handleTracker } from "@/server/trackers/handleTracker";

export async function getSubs() {
  const user = await currentUser();
  if (user?.id) {
    return await getUserTrackers(user.id);
  }
  return [];
}

type CampingData = {
  name: string;
};
type CampingDataFetchers = Record<string, (id: string) => Promise<CampingData>>;

const reserveCaliforniaSchema = z.object({
  Name: z.string(),
});
const recreationGovSchema = z.object({
  campground: z.object({
    facility_name: z.string(),
  }),
});

const campingDataFetchers: CampingDataFetchers = {
  [CampProvider.RESERVE_CALIFORNIA]: async (id: string) => {
    const response = await fetch(
      `https://calirdr.usedirect.com/RDR/rdr/fd/facilities/${id}`,
      { headers: { "Content-Type": "application/json" } },
    );
    if (!response.ok || response.status !== 200) {
      throw new Error("Failed to fetch camping data from reservecalifornia");
    }

    const rawData = await response.json();
    console.log(rawData);
    const data = reserveCaliforniaSchema.parse(rawData);
    return { name: data.Name };
  },
  [CampProvider.RECREATION]: async (id: string) => {
    const response = await fetch(
      `https://www.recreation.gov/api/camps/campgrounds/${id}`,
      { headers: { "Content-Type": "application/json" } },
    );
    if (!response.ok || response.status !== 200) {
      throw new Error("Failed to fetch camping data from recreation.gov");
    }
    const rawData = await response.json();
    console.log(rawData);
    // TODO: return error if campground not found
    const data = recreationGovSchema.parse(rawData);
    return { name: data.campground.facility_name };
  },
};

export async function getCampingData(provider: string, id: string) {
  const fetcher = campingDataFetchers[provider];
  if (!fetcher) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return await fetcher(id);
}

export async function updateTracker(data: Tracker) {
  const user = await currentUser();
  if (user?.id) {
    data.trackingState = {};
    const [updatedTracker] = await updateTrackerDb(data);
    if (updatedTracker.active) {
      await handleTracker(updatedTracker);
    }
    // revalidatePath("/");
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
    // revalidatePath("/");
  }
}

export async function removeTracker(trackerId: string) {
  const user = await currentUser();
  if (user?.id) {
    await removeTrackerDb(trackerId);
    // revalidatePath("/");
  }
}
