import { runActiveTrackers } from "@/server/trackers/runActiveTrackers";

export async function GET() {
  await runActiveTrackers();
  return Response.json("success");
}
