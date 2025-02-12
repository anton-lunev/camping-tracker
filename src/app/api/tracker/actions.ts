import { revalidatePath } from "next/cache";
import {
  restartTracker,
  startTracker,
  stopTracker,
} from "@/server/scheduler/trackers";
import type { NewTracker } from "@/db/queries/trackers";
import {
  addTrackerDb,
  removeTrackerDb,
  updateTrackerDb,
} from "@/db/queries/trackers";
import { currentUser } from "@clerk/nextjs/server";
import type { Tracker } from "@/db/schema";

export async function updateTracker(data: Tracker) {
  const user = await currentUser();
  if (user?.id) {
    await updateTrackerDb(data);
    if (data.active) {
      restartTracker(data.id.toString(), data.interval);
    } else {
      stopTracker(data.id.toString());
    }
    revalidatePath("/");
  }
}

export async function createTracker(newTracker: Omit<NewTracker, "owner">) {
  const user = await currentUser();
  if (user?.id) {
    const data = await addTrackerDb({ ...newTracker, owner: user.id });
    const [tracker] = data;
    if (tracker) {
      startTracker(tracker.id.toString(), tracker.interval);
      revalidatePath("/");
    }
  }
}

export async function removeTracker(trackerId: string) {
  const user = await currentUser();
  if (user?.id) {
    stopTracker(trackerId);
    await removeTrackerDb(trackerId);
    revalidatePath("/");
  }
}
