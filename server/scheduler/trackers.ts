import { createJob, listJobs, secondsToCron, stopAllJobs, stopJob } from "./scheduler";
import { handleTracker } from "@/server/trackers/handleTracker";
import { getTrackers } from "@/server/scheduler/actions";

/**
 * Start all defined trackers.
 */
export async function startTrackers() {
  const trackers = await getTrackers();
  console.log("Starting trackers...", trackers.map((sub) => sub.id).join(", "));
  trackers?.forEach((sub) => {
    startTracker(sub.id, sub.interval);
  });
}

export function startTracker(trackerId: string, interval: number = 60) {
  createJob({
    id: trackerId,
    rule: secondsToCron(interval),
    handler: handleTracker,
  });
}

/**
 * Stop a specific tracker by ID.
 * @param trackerId - ID of the tracker to stop.
 */
export function stopTracker(trackerId: string) {
  stopJob(trackerId);
}

export function restartTracker(trackerId: string, interval?: number) {
  stopTracker(trackerId);
  startTracker(trackerId, interval);
}

/**
 * Stop all trackers.
 */
export function stopAllTrackers() {
  stopAllJobs();
}

/**
 * List all active tracker IDs.
 * @returns An array of active tracker IDs.
 */
export function listActiveTrackers(): string[] {
  return listJobs();
}
