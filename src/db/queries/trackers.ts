import { db } from "../";
import { asc, eq } from "drizzle-orm";
import type { Tracker } from "../schema";
import { trackers } from "../schema";

export type NewTracker = Omit<
  Tracker,
  "id" | "createdAt" | "updatedAt" | "trackingState"
>;

export function getActiveTrackers() {
  return db.query.trackers.findMany({
    where: (trackers, { eq }) => eq(trackers.active, true),
  });
}

export function getTrackerById(id: string) {
  return db.query.trackers.findFirst({ where: eq(trackers.id, id) });
}

export function getUserTrackers(userId: string) {
  return db.query.trackers.findMany({
    where: (trackers, { eq }) => eq(trackers.owner, userId),
    orderBy: [asc(trackers.createdAt)],
  });
}

export function addTrackerDb(tracker: NewTracker) {
  return db.insert(trackers).values(tracker).returning();
}

export function updateTrackerDb(tracker: Tracker) {
  console.log("updateTrackerDb", tracker);
  return db
    .update(trackers)
    .set(tracker)
    .where(eq(trackers.id, tracker.id))
    .execute();
}

export function removeTrackerDb(trackerId: string) {
  return db.delete(trackers).where(eq(trackers.id, trackerId));
}
