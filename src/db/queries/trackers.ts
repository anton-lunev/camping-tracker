import { db } from "../";
import { asc, eq } from "drizzle-orm";
import { trackers, TrackingState } from "../schema";

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
  trackingState?: TrackingState;
};

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
  return db.update(trackers).set(tracker).where(eq(trackers.id, tracker.id));
}
