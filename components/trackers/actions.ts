"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  restartTracker,
  startTracker,
  stopTracker,
} from "@/server/scheduler/trackers";

export type Camping = {
  id: string;
  name: string;
  provider: string;
};

export interface Tracker {
  id: number;
  created_at: string;
  campings: Camping[];
  start_date: string;
  end_date: string;
  week_days?: number[];
  days?: string[];
  active: boolean;
  interval?: number;
}

export type NewTracker = Omit<Tracker, "id" | "created_at">;

export async function getSubs() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", user?.user?.id);
    return (data ?? []) as Tracker[];
  }
  return [];
}

export async function updateTracker(data: Tracker) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    await supabase.from("subscriptions").update(data).eq("id", data.id);
    if (data.active) {
      restartTracker(data.id.toString(), data.interval);
    } else {
      stopTracker(data.id.toString());
    }
    revalidatePath("/");
  }
}

export async function createTracker(newTracker: NewTracker) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    const { data } = await supabase
      .from("subscriptions")
      .insert(newTracker)
      .select();
    const [tracker] = (data ?? []) as Tracker[];
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

const campingDataFetchers: CampingDataFetchers = {
  reservecalifornia: async (id: string) => {
    const response = await fetch(
      `https://calirdr.usedirect.com/RDR/rdr/fd/facilities/${id}`,
      { headers: { "Content-Type": "application/json" } },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch camping data from reservecalifornia");
    }
    const data = await response.json();
    console.log(data);
    return {
      name: data.Name,
    };
  },
  "recreation.gov": async (id: string) => {
    const response = await fetch(
      `https://www.recreation.gov/api/camps/campgrounds/${id}`,
      { headers: { "Content-Type": "application/json" } },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch camping data from recreation.gov");
    }
    const data = await response.json();
    console.log(data);
    return {
      name: data.campground.facility_name,
    };
  },
};

export async function getCampingData(provider: string, id: string) {
  const fetcher = campingDataFetchers[provider];
  if (!fetcher) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return await fetcher(id);
}
