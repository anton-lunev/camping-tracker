import { revalidatePath } from "next/cache";
import type { NewTracker } from "@/db/queries/trackers";
import {
  addTrackerDb,
  removeTrackerDb,
  updateTrackerDb,
} from "@/db/queries/trackers";
import { currentUser } from "@clerk/nextjs/server";
import type { Tracker } from "@/db/schema";
import { handleTracker } from "@/server/trackers/handleTracker";

export async function updateTracker(data: Tracker) {
  const user = await currentUser();
  if (user?.id) {
    if (!data.active) data.trackingState = {};
    await updateTrackerDb(data);
    if (data.active) {
      await handleTracker(data);
    }
    revalidatePath("/");
  }
}

export async function createTracker(newTracker: Omit<NewTracker, "owner">) {
  const user = await currentUser();
  if (user?.id) {
    const data = await addTrackerDb({ ...newTracker, owner: user.id });
    const [tracker] = data;
    if (tracker.active) {
      await handleTracker(tracker);
    }
    revalidatePath("/");
  }
}

export async function removeTracker(trackerId: string) {
  const user = await currentUser();
  if (user?.id) {
    await removeTrackerDb(trackerId);
    revalidatePath("/");
  }
}
