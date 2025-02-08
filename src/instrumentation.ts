export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startTrackers } = await import("@/server/scheduler/trackers");
    await startTrackers();
  }
}
