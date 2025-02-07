import { createJob, listJobs, stopAllJobs, stopJob } from "./scheduler";
import { handleTracker } from "@/server/trackers/handleTracker";
import { getActiveTrackers } from "@/db/queries/trackers";
import { Logger } from "@/server/utils/logger";

const logger = Logger.for("Scheduler");

/**
 * Start all defined trackers.
 */
export async function startTrackers() {
  logger.debug("startTrackers");
  const trackers = await getActiveTrackers();
  logger.debug(
    "Starting trackers...",
    trackers.map((sub) => sub.id).join(", "),
  );
  trackers?.forEach((sub) => {
    startTracker(sub.id, sub.interval);
  });
}

export function startTracker(trackerId: string, interval: number = 60) {
  logger.debug("startTracker", { trackerId });
  createJob({
    id: trackerId,
    interval: interval,
    handler: handleTracker,
  });
}

/**
 * Stop a specific tracker by ID.
 * @param trackerId - ID of the tracker to stop.
 */
export function stopTracker(trackerId: string) {
  logger.debug("stopTracker", { trackerId });
  stopJob(trackerId);
}

export function restartTracker(trackerId: string, interval?: number) {
  logger.debug("restartTracker", { trackerId });
  stopTracker(trackerId);
  startTracker(trackerId, interval);
}

/**
 * Stop all trackers.
 */
export function stopAllTrackers() {
  logger.debug("stopAllTrackers");
  stopAllJobs();
}

/**
 * List all active tracker IDs.
 * @returns An array of active tracker IDs.
 */
export function listActiveTrackers(): string[] {
  logger.debug("listActiveTrackers");
  return listJobs();
}
