"use server";
import { findCamp, findCamp1 } from "./index";
import { createClient } from "@/utils/supabase/common";

export async function handleTracker(trackerId: string) {
  // This function will be called when the tracker is triggered
  console.log(`Tracker ${trackerId} logic running...`);
  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*")
    .limit(1)
    .eq("id", trackerId);

  const [sub] = subs ?? [];
  if (!sub) {
    return;
  }

  // TODO: call findCamp1 depending on provider
  sub.campings.forEach(
    (camping: { id: string; name: string; provider: string }) => {
      if (camping.provider === "reservecalifornia") {
        const [parkId, campingId] = camping.id.split(":");
        findCamp1(
          { campingId, parkId },
          sub.days,
          sub.week_days,
          sub.start_date,
          sub.end_date,
        );
      } else {
        findCamp(
          camping.id,
          sub.days,
          sub.week_days,
          sub.start_date,
          sub.end_date,
        );
      }
    },
  );
}
