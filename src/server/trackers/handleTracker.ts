"use server";
import { findCamp, findCamp1 } from "./index";
import { getTrackerById } from "@/db/queries/trackers";

export async function handleTracker(trackerId: string) {
  // This function will be called when the tracker is triggered
  console.log(`Tracker ${trackerId} logic running...`);
  const sub = await getTrackerById(trackerId);
  if (!sub) {
    return;
  }

  sub.campings.forEach(
    (camping: { id: string; name: string; provider: string }) => {
      if (camping.provider === "reservecalifornia") {
        const [parkId, campingId] = camping.id.split(":");
        findCamp1(
          { campingId, parkId },
          sub.days,
          sub.weekDays,
          sub.startDate,
          sub.endDate,
        );
      } else {
        findCamp(
          camping.id,
          sub.days,
          sub.weekDays,
          sub.startDate,
          sub.endDate,
        );
      }
    },
  );
}
