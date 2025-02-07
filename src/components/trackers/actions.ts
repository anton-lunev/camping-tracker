"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  restartTracker,
  startTracker,
  stopTracker,
} from "@/server/scheduler/trackers";
import {
  addTrackerDb,
  getUserTrackers,
  NewTracker,
  Tracker,
  updateTrackerDb,
} from "@/db/queries/trackers";
import { z } from "zod";
import { CampProvider } from "@/server/trackers/providers/providerAdapterFactory";

export async function getSubs() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    return await getUserTrackers(user.user.id);
  }
  return [];
}

export async function updateTracker(data: Tracker) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    await updateTrackerDb(data);
    if (data.active) {
      restartTracker(data.id.toString(), data.interval);
    } else {
      stopTracker(data.id.toString());
    }
    revalidatePath("/");
  }
}

export async function createTracker(newTracker: Omit<NewTracker, "owner">) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    const data = await addTrackerDb({ ...newTracker, owner: user.user.id });
    const [tracker] = data;
    if (tracker) {
      startTracker(tracker.id.toString(), tracker.interval);
      revalidatePath("/");
    }
  }
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
