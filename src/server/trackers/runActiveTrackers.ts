import { getActiveTrackers } from "@/db/queries/trackers";
import { handleTracker } from "@/server/trackers/handleTracker";
import { Logger } from "@/server/utils/logger";

export async function runActiveTrackers() {
  console.log("running jobs...");
  // TODO: pick trackers by interval
  const trackers = await getActiveTrackers();
  for (const tracker of trackers) {
    try {
      void handleTracker(tracker);
    } catch (error) {
      Logger.error("runActiveTrackers", "unexpected error", error);
    }
  }
}
