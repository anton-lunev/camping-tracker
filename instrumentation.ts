import { startTrackers } from "@/server/scheduler/trackers";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    startTrackers();
  }
}
