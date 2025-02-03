import { db } from "../";
import { asc, eq } from "drizzle-orm";
import { trackers } from "../schema";

export type Camping = {
  id: string;
  name: string;
  provider: string;
};

export type Tracker = {
  id: string;
  updatedAt: string;
  createdAt: string;
  campings: Camping[];
  startDate: string;
  endDate: string;
  weekDays: number[];
  days: string[];
  active: boolean;
  interval: number;
  owner: string;
};

export type NewTracker = Omit<Tracker, "id" | "createdAt" | "updatedAt">;

export function getActiveTrackers() {
  return db.query.trackers.findMany({
    where: (trackers, { eq }) => eq(trackers.active, true),
  });
}

export function getUserTrackers(userId: string) {
  return db.query.trackers.findMany({
    where: (trackers, { eq }) => eq(trackers.owner, userId),
    orderBy: [asc(trackers.createdAt)],
  });
}

export function addTrackerDb(tracker: NewTracker) {
  console.log(tracker);
  return db.insert(trackers).values(tracker).returning();
}

export function updateTrackerDb(tracker: Tracker) {
  return db.update(trackers).set(tracker).where(eq(trackers.id, tracker.id));
}
