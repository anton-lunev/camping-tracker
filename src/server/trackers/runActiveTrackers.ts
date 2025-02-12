import { getActiveTrackers } from "@/db/queries/trackers";
import { handleTracker } from "@/server/trackers/handleTracker";
import { Logger } from "@/server/utils/logger";

export async function runActiveTrackers() {
  console.log("running jobs...");
  // TODO: pick trackers by interval
  const trackers = await getActiveTrackers();

  return Promise.all(
    trackers.map(async (tracker) => {
      try {
        await handleTracker(tracker);
      } catch (error) {
        Logger.error("runActiveTrackers", "unexpected error", error);
      }
    }),
  );
}
